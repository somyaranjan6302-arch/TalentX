import { ROLES_CATALOG } from '../data/mockData.js';

const NON_DISTINCTIVE_SKILL_WORDS = new Set([
  'and',
  'business',
  'cloud',
  'data',
  'deep',
  'developer',
  'engineering',
  'engineer',
  'for',
  'full',
  'learning',
  'machine',
  'model',
  'software',
  'the',
  'with',
]);

function normalizeSkill(skill) {
  return String(skill || '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function skillsMatch(left, right) {
  const normalizedLeft = normalizeSkill(left);
  const normalizedRight = normalizeSkill(right);
  if (!normalizedLeft || !normalizedRight) return false;
  if (normalizedLeft === normalizedRight) return true;

  const leftTokens = normalizedLeft.split(' ');
  const rightTokens = new Set(normalizedRight.split(' '));
  return leftTokens.some(token => (
    token.length >= 3
    && !NON_DISTINCTIVE_SKILL_WORDS.has(token)
    && rightTokens.has(token)
  ));
}

export function getCareerRecommendations(skills) {
  const skillNames = [...new Set(
    skills
      .map(skill => (typeof skill === 'string' ? skill : skill?.name))
      .filter(skill => typeof skill === 'string' && skill.trim())
      .map(skill => skill.trim())
  )];

  return Object.values(ROLES_CATALOG)
    .map(role => {
      const requiredSkills = role.requiredSkills.filter(required => (
        skillNames.some(skill => skillsMatch(skill, required))
      ));
      const advancedSkills = role.advancedSkills.filter(advanced => (
        skillNames.some(skill => skillsMatch(skill, advanced))
      ));
      const totalWeight = role.requiredSkills.length * 2 + role.advancedSkills.length;
      const matchedWeight = requiredSkills.length * 2 + advancedSkills.length;

      return {
        ...role,
        score: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
        matchedSkills: [...requiredSkills, ...advancedSkills],
        missingSkills: [
          ...role.requiredSkills.filter(skill => !requiredSkills.includes(skill)),
          ...role.advancedSkills.filter(skill => !advancedSkills.includes(skill)),
        ],
        matchedRequiredSkills: requiredSkills,
      };
    })
    .sort((left, right) => (
      right.score - left.score
      || right.matchedRequiredSkills.length - left.matchedRequiredSkills.length
      || left.title.localeCompare(right.title)
    ));
}
