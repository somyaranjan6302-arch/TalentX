import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { DataType, newDb } from 'pg-mem';
import express from 'express';
import { createAuthRouter } from './auth.js';
import { createCareerRouter } from './career.js';
import { initializeDatabase } from './db.js';

const memory = newDb();
memory.public.registerFunction({
  name: 'char_length',
  args: [DataType.text],
  returns: DataType.integer,
  implementation: value => [...value].length,
});
const Pool = memory.adapters.createPg().Pool;
const database = new Pool();
const otpCodes = new Map();
const otpSecret = 'career-test-otp-secret-with-at-least-32-chars';
const app = express();
app.use(express.json());
app.use('/api/auth', createAuthRouter(database, {
  userCapacity: 5,
  otpSecret,
  sendOtp: async ({ email, code, purpose }) => otpCodes.set(`${purpose}:${email}`, code),
}));
app.use('/api/career', createCareerRouter(database, {
  userCapacity: 5,
  loadModel: async () => ({ ready: true }),
  predictCareer: async (skills, model) => {
    assert.equal(model.ready, true);
    assert.deepEqual(skills, ['Python', 'SQL']);
    return {
      modelName: 'TF-IDF Multinomial Naive Bayes',
      predictedRole: 'Data Scientist / ML Engineer',
      confidencePercent: 84,
      roleProbabilities: [],
      salaryDistribution: [],
      postingsAnalyzed: 695,
      datasetRecords: 15840,
      validationAccuracyPercent: 72,
    };
  },
}));

let server;
let baseUrl;

before(async () => {
  await initializeDatabase(database);
  server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await database.end();
});

async function post(path, body, cookie) {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
}

test('career prediction authenticates candidates, validates skills, and returns model results', async () => {
  const unauthenticated = await post('/api/career/predict', { skills: ['Python'] });
  assert.equal(unauthenticated.status, 401);

  const email = 'career-candidate@example.com';
  const registration = await post('/api/auth/register', {
    name: 'Career Candidate',
    email,
    password: 'career-candidate-password',
    role: 'candidate',
  });
  assert.equal(registration.status, 202);
  const verification = await post('/api/auth/register/verify', {
    email,
    code: otpCodes.get(`signup:${email}`),
  });
  assert.equal(verification.status, 201);
  const cookie = verification.headers.get('set-cookie').split(';', 1)[0];

  const invalid = await post('/api/career/predict', { skills: [' '] }, cookie);
  assert.equal(invalid.status, 400);

  const prediction = await post('/api/career/predict', {
    skills: [' Python ', 'SQL'],
  }, cookie);
  const predictionResult = await prediction.json();
  assert.equal(prediction.status, 200, JSON.stringify(predictionResult));
  assert.equal(predictionResult.predictedRole, 'Data Scientist / ML Engineer');

  const logout = await post('/api/auth/logout', {}, cookie);
  assert.equal(logout.status, 204);
});
