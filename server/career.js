import { Router } from 'express';
import { authenticate, requireRole } from './auth.js';
import { loadCareerModel, predictCareer } from './careerModel.js';

const MAX_SKILLS = 60;
const MAX_SKILL_LENGTH = 80;

export function createCareerRouter(database, options = {}) {
  const router = Router();
  const userCapacity = options.userCapacity ?? Number(process.env.USER_CAPACITY || 50);
  const loadModel = options.loadModel || loadCareerModel;
  const makePrediction = options.predictCareer || predictCareer;
  let modelPromise;

  router.use(authenticate(database, { userCapacity }), requireRole('candidate'));

  router.post('/predict', async (request, response) => {
    const skills = request.body?.skills;
    if (
      !Array.isArray(skills)
      || skills.length < 1
      || skills.length > MAX_SKILLS
      || skills.some(skill => (
        typeof skill !== 'string'
        || !skill.trim()
        || skill.trim().length > MAX_SKILL_LENGTH
      ))
    ) {
      return response.status(400).json({
        error: `Provide 1 to ${MAX_SKILLS} skills, each between 1 and ${MAX_SKILL_LENGTH} characters.`,
      });
    }
    try {
      modelPromise ||= loadModel();
      const model = await modelPromise;
      const prediction = await makePrediction(skills.map(skill => skill.trim()), model);
      return response.json(prediction);
    } catch (error) {
      if (!error.status || error.status >= 500) {
        modelPromise = undefined;
        console.error('Career model prediction failed:', error);
      }
      return response.status(error.status || 503).json({
        error: error.message || 'The career model could not process this request.',
      });
    }
  });

  return router;
}
