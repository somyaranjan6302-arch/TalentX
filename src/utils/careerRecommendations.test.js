import test from 'node:test';
import assert from 'node:assert/strict';
import { getCareerRecommendations, skillsMatch } from './careerRecommendations.js';

test('skill matching handles punctuation and avoids generic data-word matches', () => {
  assert.equal(skillsMatch('Pandas and NumPy', 'Pandas & NumPy'), true);
  assert.equal(skillsMatch('Cloud AWS', 'Cloud (AWS/GCP)'), true);
  assert.equal(skillsMatch('Data Scientist', 'Data Analyst'), false);
});

test('career recommendations prioritize required skill matches and explain gaps', () => {
  const [bestMatch] = getCareerRecommendations(['Python', 'SQL', 'Statistics']);

  assert.equal(bestMatch.title, 'Data Analyst');
  assert.ok(bestMatch.score > 0);
  assert.ok(bestMatch.matchedRequiredSkills.includes('Python'));
  assert.ok(bestMatch.missingSkills.includes('Power BI'));
});

test('career recommendations return zero matches for an empty skill list', () => {
  const recommendations = getCareerRecommendations([]);

  assert.ok(recommendations.length > 0);
  assert.ok(recommendations.every(recommendation => recommendation.score === 0));
});
