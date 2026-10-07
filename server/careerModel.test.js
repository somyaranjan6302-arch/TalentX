import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCareerCsv, predictCareer, trainCareerModel } from './careerModel.js';

test('CSV parsing handles quoted commas, escaped quotes, and multiline descriptions', () => {
  const csv = [
    'job_description,job_desig,key_skills,salary',
    '"Build ""smart"", reliable systems',
    'for people",Data Scientist,"Python, SQL",10to15',
    '"Find useful patterns",Data Analyst,"Excel, Power BI",3to6',
  ].join('\n');

  const rows = parseCareerCsv(csv);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].job_desig, 'Data Scientist');
  assert.deepEqual(rows[0].terms, ['python', 'sql']);
});

test('dataset parsing reports missing required CSV columns', () => {
  assert.throws(
    () => parseCareerCsv('job_desig,key_skills\nData Scientist,Python'),
    /missing required columns: salary/,
  );
});

test('dataset-trained career model predicts a role and its salary distribution', () => {
  const csvRows = ['job_desig,key_skills,salary'];
  for (let index = 0; index < 30; index += 1) {
    csvRows.push(`Data Scientist,"Python, SQL, Statistics, mlfeature${index}",10to15`);
    csvRows.push(`Data Analyst,"Excel, Power BI, reporting, anafeature${index}",3to6`);
  }
  const jobs = parseCareerCsv(csvRows.join('\n'));
  const model = trainCareerModel(jobs);

  const prediction = predictCareer(['Python', 'SQL', 'Statistics'], model);

  assert.equal(prediction.modelName, 'TF-IDF Multinomial Naive Bayes');
  assert.equal(prediction.predictedRole, 'Data Scientist / ML Engineer');
  assert.equal(prediction.datasetRecords, 60);
  assert.ok(prediction.validationAccuracyPercent >= 0);
  assert.equal(prediction.salaryDistribution[0].code, '10to15');
});

test('unknown skills return an actionable validation error', () => {
  const csvRows = ['job_desig,key_skills,salary'];
  for (let index = 0; index < 12; index += 1) {
    csvRows.push(`Data Scientist,"Python, SQL, mlfeature${index}",10to15`);
    csvRows.push(`Data Analyst,"Excel, Power BI, anafeature${index}",3to6`);
  }
  const model = trainCareerModel(parseCareerCsv(csvRows.join('\n')));

  assert.throws(
    () => predictCareer(['spaceship gardening'], model),
    /None of those skills match the dataset vocabulary/,
  );
});
