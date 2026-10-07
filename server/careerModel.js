import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_DATASET_PATH = path.join(projectRoot, 'data', 'Cleanedanalytics.csv');
const SALARY_RANGES = {
  '0to3': '0 - 3 LPA',
  '3to6': '3 - 6 LPA',
  '6to10': '6 - 10 LPA',
  '10to15': '10 - 15 LPA',
  '15to25': '15 - 25 LPA',
  '25to50': '25 - 50+ LPA',
};
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'in', 'is',
  'of', 'on', 'or', 'the', 'to', 'with',
]);

export function parseCareerCsv(csv) {
  const rows = [];
  let row = [];
  let field = '';
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (insideQuotes) {
      if (character === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        insideQuotes = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      insideQuotes = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n' || character === '\r') {
      row.push(field);
      field = '';
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      if (character === '\r' && csv[index + 1] === '\n') index += 1;
    } else {
      field += character;
    }
  }
  if (insideQuotes) throw new Error('Career dataset contains an unterminated quoted field.');
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some(value => value.trim())) rows.push(row);
  }
  if (rows.length < 2) throw new Error('Career dataset must include a header and at least one job posting.');

  const headers = rows[0].map(header => header.replace(/^\uFEFF/, '').trim().toLowerCase());
  const requiredColumns = ['key_skills', 'job_desig', 'salary'];
  const missingColumns = requiredColumns.filter(column => !headers.includes(column));
  if (missingColumns.length) {
    throw new Error(`Career dataset is missing required columns: ${missingColumns.join(', ')}.`);
  }
  const columnIndexes = Object.fromEntries(
    requiredColumns.map(column => [column, headers.indexOf(column)])
  );

  return rows.slice(1).flatMap(values => {
    const job = Object.fromEntries(
      requiredColumns.map(column => [
        column,
        (values[columnIndexes[column]] || '').trim(),
      ])
    );
    if (!job.key_skills || !job.job_desig || !job.salary) return [];
    const careerCategory = categorizeRole(job.job_desig);
    const terms = tokenize(job.key_skills);
    if (!terms.length) return [];
    return [{ ...job, careerCategory, terms }];
  });
}

function categorizeRole(title) {
  const role = title.toLowerCase();
  if (['data scientist', 'machine learning', 'deep learning', 'ai ', 'artificial intelligence']
    .some(keyword => role.includes(keyword))) {
    return 'Data Scientist / ML Engineer';
  }
  if (['data analyst', 'business analyst', 'analytics', 'bi analyst', 'business intelligence']
    .some(keyword => role.includes(keyword))) {
    return 'Data / Business Analyst';
  }
  if (['data engineer', 'etl', 'big data', 'database', 'sql developer', 'data architect']
    .some(keyword => role.includes(keyword))) {
    return 'Data Engineer / Database Developer';
  }
  if (['software engineer', 'developer', 'full stack', 'web developer', 'python developer']
    .some(keyword => role.includes(keyword))) {
    return 'Software Engineer / Developer';
  }
  if (['product manager', 'marketing', 'project manager', 'digital marketing', 'seo']
    .some(keyword => role.includes(keyword))) {
    return 'Product & Digital Strategy';
  }
  return 'Other Specialized Roles';
}

function tokenize(value) {
  return value
    .toLowerCase()
    .split(/[,|]/)
    .flatMap(skill => skill.split(/[^a-z0-9+#.]+/))
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

function createSeededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createClassifier(trainingJobs) {
  const classes = new Map();
  const documentFrequencies = new Map();

  for (const job of trainingJobs) {
    let careerClass = classes.get(job.careerCategory);
    if (!careerClass) {
      careerClass = { documents: 0, terms: new Map(), totalTerms: 0 };
      classes.set(job.careerCategory, careerClass);
    }
    careerClass.documents += 1;
    const uniqueTerms = new Set(job.terms);
    for (const term of job.terms) {
      careerClass.totalTerms += 1;
      careerClass.terms.set(term, (careerClass.terms.get(term) || 0) + 1);
    }
    for (const term of uniqueTerms) {
      documentFrequencies.set(term, (documentFrequencies.get(term) || 0) + 1);
    }
  }
  if (classes.size < 2) {
    throw new Error('Career dataset needs postings in at least two role categories.');
  }
  for (const [name, careerClass] of classes) {
    if (careerClass.documents < 2) {
      throw new Error(`Career category "${name}" needs at least two job postings.`);
    }
  }

  return { classes, documentFrequencies };
}

function scoreClasses(terms, classifier, vocabularySize, documentCount, allowUnseen = false) {
  const knownTerms = terms.filter(term => classifier.documentFrequencies.has(term));
  if (!knownTerms.length && !allowUnseen) {
    const error = new Error('None of those skills match the dataset vocabulary. Try common job-skill names.');
    error.status = 400;
    throw error;
  }

  return [...classifier.classes].map(([role, careerClass]) => {
    let score = Math.log(careerClass.documents / documentCount);
    for (const term of knownTerms) {
      const occurrences = careerClass.terms.get(term) || 0;
      const inverseDocumentFrequency = Math.log(
        1 + documentCount / classifier.documentFrequencies.get(term)
      );
      score += inverseDocumentFrequency * Math.log(
        (occurrences + 1) / (careerClass.totalTerms + vocabularySize)
      );
    }
    return { role, score };
  });
}

function classify(
  terms,
  classifier,
  vocabularySize,
  documentCount,
  allowUnseen = false,
  temperature = 1,
) {
  const results = scoreClasses(
    terms,
    classifier,
    vocabularySize,
    documentCount,
    allowUnseen,
  );
  const maximumScore = Math.max(...results.map(result => result.score));
  const expScores = results.map(result => Math.exp((result.score - maximumScore) / temperature));
  const expTotal = expScores.reduce((total, score) => total + score, 0);
  return results
    .map((result, index) => ({
      role: result.role,
      probabilityPercent: Math.round((expScores[index] / expTotal) * 1000) / 10,
    }))
    .sort((left, right) => right.probabilityPercent - left.probabilityPercent);
}

function calibrateTemperature(testJobs, classifier, vocabularySize, trainingCount) {
  const validationScores = testJobs.map(job => ({
    actual: job.careerCategory,
    scores: scoreClasses(job.terms, classifier, vocabularySize, trainingCount, true),
  }));
  const temperatures = [0.5, 0.75, 1, 1.5, 2, 3, 5, 8, 12, 20, 40, 80];
  let bestTemperature = 1;
  let lowestLoss = Number.POSITIVE_INFINITY;

  for (const temperature of temperatures) {
    let totalLoss = 0;
    for (const { actual, scores } of validationScores) {
      const maximumScore = Math.max(...scores.map(result => result.score));
      const expScores = scores.map(result => Math.exp((result.score - maximumScore) / temperature));
      const expTotal = expScores.reduce((total, score) => total + score, 0);
      const actualIndex = scores.findIndex(result => result.role === actual);
      totalLoss -= Math.log(Math.max(expScores[actualIndex] / expTotal, Number.MIN_VALUE));
    }
    const meanLoss = totalLoss / validationScores.length;
    if (meanLoss < lowestLoss) {
      lowestLoss = meanLoss;
      bestTemperature = temperature;
    }
  }

  return bestTemperature;
}

function calculateValidationAccuracy(testJobs, classifier, vocabularySize, trainingCount) {
  let correctPredictions = 0;
  for (const job of testJobs) {
    const [prediction] = classify(
      job.terms,
      classifier,
      vocabularySize,
      trainingCount,
      true,
    );
    if (prediction.role === job.careerCategory) correctPredictions += 1;
  }
  return Math.round((correctPredictions / testJobs.length) * 1000) / 10;
}

function splitJobsByRole(jobs) {
  const groups = new Map();
  for (const job of jobs) {
    if (!groups.has(job.careerCategory)) groups.set(job.careerCategory, []);
    groups.get(job.careerCategory).push(job);
  }

  const random = createSeededRandom(42);
  const trainingJobs = [];
  const testJobs = [];
  for (const group of groups.values()) {
    for (let index = group.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [group[index], group[swapIndex]] = [group[swapIndex], group[index]];
    }
    const testCount = Math.min(group.length - 1, Math.max(1, Math.floor(group.length * 0.2)));
    testJobs.push(...group.slice(0, testCount));
    trainingJobs.push(...group.slice(testCount));
  }
  return { trainingJobs, testJobs };
}

function salaryDistribution(jobs, role) {
  const counts = new Map();
  for (const job of jobs) {
    if (job.careerCategory !== role) continue;
    counts.set(job.salary, (counts.get(job.salary) || 0) + 1);
  }
  const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([code, postings]) => ({
      code,
      range: SALARY_RANGES[code] || code,
      percentage: Math.round((postings / total) * 1000) / 10,
      postings,
    }));
}

export function trainCareerModel(jobs) {
  if (jobs.length < 2) throw new Error('Career dataset needs at least two usable job postings.');
  const { trainingJobs, testJobs } = splitJobsByRole(jobs);
  const classifier = createClassifier(trainingJobs);
  const vocabularySize = classifier.documentFrequencies.size;
  const temperature = calibrateTemperature(
    testJobs,
    classifier,
    vocabularySize,
    trainingJobs.length,
  );

  return {
    jobs,
    classifier,
    vocabularySize,
    temperature,
    validationAccuracyPercent: calculateValidationAccuracy(
      testJobs,
      classifier,
      vocabularySize,
      trainingJobs.length,
    ),
  };
}

export async function loadCareerModel(datasetPath = process.env.CAREER_DATASET_PATH || DEFAULT_DATASET_PATH) {
  let csv;
  try {
    csv = await readFile(datasetPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Career dataset not found at "${datasetPath}". Add Cleanedanalytics.csv to the data folder.`);
    }
    throw error;
  }
  return trainCareerModel(parseCareerCsv(csv));
}

export function predictCareer(skills, model) {
  const terms = tokenize(skills.join(','));
  if (!terms.length) throw new Error('Enter at least one non-empty skill.');
  const probabilities = classify(
    terms,
    model.classifier,
    model.vocabularySize,
    model.jobs.length,
    false,
    model.temperature,
  );
  const predictedRole = probabilities[0].role;

  return {
    modelName: 'TF-IDF Multinomial Naive Bayes',
    predictedRole,
    confidencePercent: probabilities[0].probabilityPercent,
    roleProbabilities: probabilities,
    salaryDistribution: salaryDistribution(model.jobs, predictedRole),
    postingsAnalyzed: model.jobs.filter(job => job.careerCategory === predictedRole).length,
    datasetRecords: model.jobs.length,
    validationAccuracyPercent: model.validationAccuracyPercent,
  };
}
