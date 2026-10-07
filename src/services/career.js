export async function predictCareer(skills) {
  let response;
  try {
    response = await fetch('/api/career/predict', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills }),
    });
  } catch {
    throw new Error('Could not reach TalentX. Check your connection and try again.');
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    throw new Error('The career prediction service returned an invalid response.');
  }

  if (!response.ok) {
    throw new Error(result.error || 'Career prediction failed. Please try again.');
  }
  return result;
}
