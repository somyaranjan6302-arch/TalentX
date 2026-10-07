# Career dataset

TalentX trains its Career AI model from the cleaned dataset at:

```text
data/Cleanedanalytics.csv
```

It expects the `key_skills`, `job_desig`, and `salary` columns. The uploaded CSV contains 15,841 postings; the model drops the one row with missing skills and trims required field values before training. TalentX trains the classifier on the first career prediction after the Node server starts. No separate Python service is required. CSV files in this folder are ignored by Git so your dataset is not committed accidentally.
