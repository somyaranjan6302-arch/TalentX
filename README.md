# TalentX — AI-Powered Talent Intelligence & Professional Network
> **Build for Bharat 2.0**: Intelligent Talent and Workforce Ecosystem  
> **Tagline**: *Learn → Build → Verify → Connect → Discover → Get Hired → Grow*

---

## 🌟 Executive Overview & Problem Statement

The contemporary talent ecosystem is fragmented across three critical stakeholders:
1. **Students & Professionals**: Struggle to identify live industry demand, lack transparent skill gap diagnostics, possess static certificates that fail to prove actual competence, and receive generic job recommendation spam.
2. **Companies & Employers**: Drown in inflated PDF resumes with keyword stuffing, spend hundreds of hours in noisy screening rounds, and lack visibility into internal workforce reskilling needs.
3. **Universities & Academics**: Operating on syllabi that lag 3–5 years behind rapid tech advances (e.g. MLOps, Cloud Native, GenAI), lacking empirical labor market telemetry.

### The TalentX Solution
Instead of treating a static resume as the sole representation of a candidate, **TalentX creates a living, dynamic, skill-based professional identity** connecting:
```
PEOPLE ↔ SKILLS ↔ JOBS ↔ LEARNING ↔ NETWORK ↔ INDUSTRY DEMAND
```

---

## 🚀 Complete 30-Slide Architecture & Feature Implementation

| Slide # | Deck Subject | TalentX Application Feature |
|---|---|---|
| **Slide 1** | Title & Bharat 2.0 Problem Statement | Brand Header, Vision Banner & 7-stage tagline (*Learn → Build → Verify → Connect → Discover → Get Hired → Grow*) |
| **Slide 2** | The Problem: Fragmented Ecosystem | Tri-party problem analysis comparing Students, Companies, and Universities |
| **Slide 3** | Our Vision: One Intelligent Ecosystem | 6-entity bidirectional knowledge linkage architecture |
| **Slide 4** | Our Solution: Dynamic Skill Identity | Living profile replacing flat PDF resumes with verified proof of competence |
| **Slide 5** | How TalentX Works: Architecture | 3-sided stakeholder synergy powered by the TalentX Intelligence Engine |
| **Slide 6** | Intelligent Professional Profile & AI Resume Parser | Dynamic Profile + NLP Resume Parser with token extraction, preview, and 1-click sync |
| **Slide 7** | Skill Intelligence: Industry Needs | Real-time demand indices, emerging tech spikes, role-skill affinities |
| **Slide 8** | Skill Verification: "Don't Just Claim. Prove It." | Timed scenario challenge tests, percentile scoring, and cryptographically signed badges with confetti celebration |
| **Slide 9** | AI Career Intelligence: "What Career Fits Me?" | Multi-dimensional role recommendations with transparent *"Why Recommended"* cards |
| **Slide 10** | Skill Gap Analysis: Know What You're Missing | Target role selector with side-by-side Matched Skills (✓) vs High-Impact Gaps (⚠) |
| **Slide 11** | Personalized Career Roadmap | Sequential milestones (Core ➔ Learn ML ➔ Build Projects ➔ Verify ➔ Apply) with progress meter |
| **Slide 12** | Career Simulator: "What If I Learn This Skill?" | Interactive sandbox recalculating alignment (+28%), unlocked roles, and salary boosts in real time |
| **Slide 13** | Professional Networking & AI-Powered Discovery | Social feed + *"People You Should Meet"* (matched on skills + hackathon goals + mentors) + Direct Messaging |
| **Slide 14** | Project & Collaboration Hub | Complementary team builder (*AI Dev + UI/UX + Backend + Data Analyst = Winning Team*) with vacant slot joining |
| **Slide 15** | Smart Opportunities: Jobs, Internships, Hackathons | Personalized opportunities ranked by AI Match % with transparent breakdown |
| **Slide 16** | Intelligent Recruitment: Employer Workflow | Job Post creation with AI requirement extraction + candidate screening funnel |
| **Slide 17** | Company-Specific Assessment Standards | Configurable cutoff criteria: Python ≥ 75%, SQL ≥ 70%, Aptitude ≥ 60%, Coding ≥ 70% |
| **Slide 18** | Explainable Candidate Matching | Transparent scorecards: Not just "87% Match" — exact verified scores and hiring justification |
| **Slide 19** | Workforce Intelligence | Current Workforce Skills vs Future Project Demand comparison + *Hire ➔ Reskill ➔ Upskill* matrix |
| **Slide 20** | University Intelligence | Academic Syllabus vs Real-Time Industry Demand telemetry with syllabus upgrade recommendations |
| **Slide 21** | Connected Skill Graph | Interactive HTML5 Canvas graph connecting People ↔ Skills ↔ Roles ↔ Jobs ↔ Companies ↔ Projects |
| **Slide 22** | AI Intelligence Engine | Architecture pipeline: Public datasets ➔ NLP extraction ➔ Normalization ➔ Recommendations |
| **Slide 23** | Data & Analytics: Actionable Intelligence | Descriptive ➔ Diagnostic ➔ Predictive ➔ Prescriptive analytics |
| **Slide 24** | Complete User Journey Loop | End-to-end continuous loop from onboarding to lifelong upskilling |
| **Slide 25** | Core Ecosystem Stakeholders | Unified 3-sided platform for Candidates, Recruiters, and Universities |
| **Slide 26** | What Makes TalentX Different? | Structural differentiation vs LinkedIn, Unstop, and legacy portals |
| **Slide 27** | MVP for Hackathon: Core Execution | 4 completed phases: Core Identity, Recruitment, Social Network, Intelligence Engine |
| **Slide 28** | Expected Impact: Bharat at Scale | Quantifiable metrics: 70% faster screening, zero resume fraud, +31% graduate employability |
| **Slide 29** | Future Scope & Roadmap | AI Career Coach, adaptive interview prep, regional talent heatmaps |
| **Slide 30** | Final Summary | The Future of Talent in India and beyond |

---

## 🛠️ Technology Stack & Aesthetics

- **Frontend Core**: React 19, Modern JavaScript (ES Modules), Vite 5.
- **Backend**: Node.js, Express, PostgreSQL, scrypt-hashed passwords, and revocable HttpOnly sessions.
- **Styling Architecture**: Vanilla CSS tokens, glassmorphism (`backdrop-filter: blur(16px)`), light surfaces with green brand accents.
- **Typography**: Google Fonts (*Outfit*, *Plus Jakarta Sans*, and *JetBrains Mono*).
- **Icons & Graphics**: Lucide React, Custom SVG icons, HTML5 Canvas graph visualizer.
- **Celebration & Micro-interactions**: `canvas-confetti` fireworks upon verified badge attainment.

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- Node.js v20+ (tested on v24)
- npm v9+

### Run locally for multiple users

Create a PostgreSQL database (local or Supabase), copy `.env.example` to `.env`, and set `DATABASE_URL` to its connection string. For OTP email, create a Brevo account, generate an API key, and verify a sender email address in Brevo. Set `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, and a random `EMAIL_OTP_SECRET` (at least 32 characters). Set a private administrator name/email and a unique password of at least 14 characters.

The app now uses PostgreSQL for local and hosted use; the previous SQLite account database is not automatically imported. Existing SQLite accounts and sessions will not appear in the new database.

```bash
# Navigate to project directory
cd TalentX

# Start the app and authentication API
npm run dev
```

Visit **`http://localhost:5173/`**. The Vite development server proxies API requests to the PostgreSQL-backed Express server.

### Career AI model

Career AI trains a TF-IDF-weighted Multinomial Naive Bayes classifier from `data/Cleanedanalytics.csv` on the first prediction request. It reads role titles, skill keywords, and salary bands directly from the CSV; no separate Python service is required. The signed-in candidate's skills go through the authenticated TalentX API. The prediction shows role-category scores, salary-range frequencies within the predicted dataset category, and a stratified holdout accuracy; scores are not hiring or personal salary guarantees. The CSV stays Git-ignored. A hosted deployment must provide the dataset file privately to the TalentX service (or set `CAREER_DATASET_PATH` to its mounted location).

For local development without Brevo email credentials, TalentX prints one-time sign-up and password-reset codes in the server terminal. This development-only mode is disabled in production. Local development without `DATABASE_URL` uses an in-memory database; account and profile data reset when the server restarts. Configure a PostgreSQL `DATABASE_URL` for data that must persist.

The server permits up to 50 distinct, active candidate/recruiter accounts at once by default. Admin accounts do not use a user slot. Accounts release their slot when they sign out or when their browser has been inactive for five minutes; an open app tab refreshes its activity every minute. Set `USER_CAPACITY` in `.env` if you want to change this limit. Member profiles, connection requests, accepted connections, feed posts, likes, and direct messages are stored in PostgreSQL and shared between signed-in accounts.

### Authentication and role access

The app starts at sign-in/create-account. New accounts must verify their email with a six-digit code before they are created. Forgot-password requests send a time-limited code to the account email; a successful reset revokes its active sessions. Codes expire after 10 minutes, allow at most five attempts, and can be re-sent once per minute. Emails are sent through the Brevo transactional email API over HTTPS.

After email verification, candidate accounts complete a required profile before entering the talent workspace. Recruiter accounts are created as pending and can enter the hiring workspace only after an administrator approves them; approved recruiters complete the same required profile before entering their hiring workspace. The setup includes a profile and cover photo, background, skills, experience, education, projects, certifications, and social links; it can be edited later from the profile page. Recruiters have a separate profile destination with a TalentX Recruiter badge. Profile details and uploaded photos are stored with the user in PostgreSQL. User accounts, admin accounts, verification challenges, and sessions are also stored in PostgreSQL.

The recruiter can then use **Check approval status** or sign in again. The API uses port `3001` by default; `PORT` changes it for production. In production, `npm start` serves the built frontend and API over the host's HTTPS endpoint. Production cookies are Secure and HttpOnly.

### Admin recruiter approvals

Create a private `.env` file from `.env.example`, and set `ADMIN_NAME`, `ADMIN_EMAIL`, and a unique `ADMIN_PASSWORD` with at least 14 characters. Keep `.env` private; it is ignored by Git. When all three variables are set, startup creates the administrator if it is missing. To deliberately rotate its password, run:

```bash
npm run auth:admin:create
```

On the login tab, sign in using that admin email and password (admin is not a public signup role). The admin dashboard lists pending recruiter requests and lets the admin approve or reject them. Recruiters sign in with their own credentials after approval to access the Hiring portal. Never use example credentials in production.

### Free deployment (Render + Supabase)

The repository includes a Render Blueprint in `render.yaml`. It configures the free Render web service, build/start commands, health check, 50-user active-session limit, and prompts for secrets without storing them in Git.

1. Create a Supabase project and open **Connect**. Copy its PostgreSQL **Session pooler** connection string. Keep the password private.
2. In Brevo, create an API key and verify the sender email address you want TalentX to send from.
3. In Render, create a **Blueprint** from this GitHub repository. In the setup form, provide `DATABASE_URL`, `ADMIN_NAME`, `ADMIN_EMAIL`, a unique `ADMIN_PASSWORD` (at least 14 characters), `BREVO_API_KEY`, and `BREVO_SENDER_EMAIL`. Set `EMAIL_OTP_SECRET` to a random secret of at least 32 characters (Render can generate one). Enter secrets directly into Render's private environment-variable fields, never into source files or chat.
4. Confirm the free web service, then deploy. Render runs the production build and the service health check at `/api/health`. The first successful server start initializes the tables and provisions the admin from those environment variables.
5. Open the Render URL, sign in as the administrator, and review recruiter requests. Up to 50 active candidate/recruiter accounts are allowed by default; set `USER_CAPACITY` in Render if needed.

The free Render service may sleep when idle, and its local filesystem is ephemeral; PostgreSQL data remains in Supabase. Supabase's free database has size and inactivity limits and may pause after prolonged inactivity. This is suitable for a trial/demo, not a reliability or backup guarantee. Configure backups and a paid database/service before relying on it for important or production data. Existing local SQLite accounts are not copied; users must register again on the deployed site.

The login screen calls these same-origin JSON endpoints, so a separately designed login page can replace the current screen without changing the account system:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create candidate/recruiter account; body: `{ name, email, password, role }` |
| `POST` | `/api/auth/register/verify` | Verify the emailed code and create the account; body: `{ email, code }` |
| `POST` | `/api/auth/login` | Sign in; body: `{ email, password }` |
| `POST` | `/api/auth/password/forgot` | Send a password reset code; body: `{ email }` |
| `POST` | `/api/auth/password/reset` | Verify code and set a new password; body: `{ email, code, password }` |
| `GET` | `/api/auth/me` | Restore the signed-in account from its HttpOnly session cookie |
| `PATCH` | `/api/auth/profile` | Save a complete candidate profile; body: `{ "profile": { ... } }` |
| `POST` | `/api/auth/logout` | Revoke the current session |
| `GET` | `/api/admin/recruiters?status=pending` | Admin-only recruiter request list; status can be pending, approved, rejected, or all |
| `PATCH` | `/api/admin/recruiters/:id` | Admin-only decision; JSON body `{ "status": "approved" }` or `{ "status": "rejected" }` |

Recruiter approval is restricted to authenticated administrator sessions. Email verification and password reset rely on a configured Brevo API key and verified sender; without them, codes cannot be delivered.

The candidate and recruiter experiences still include demo data in other portal areas; profile details, uploaded profile photos, user accounts, and sessions are persisted in PostgreSQL. Hiring data is not yet persisted. The React UI hides the other role's workspace, and `authenticate`/`requireRole` middleware in `server/auth.js` is available to enforce roles on future API endpoints.

### Build Production Bundle
```bash
npm run build
```
Generates optimized static assets in `dist/`.

Run the authentication tests with `npm run test:auth`.

---

## 🎯 How to Present to Hackathon Judges / Investors

1. **Direct Live Pitch Deck**:
   - Click the **"30-Slide Pitch Deck"** button in the top navigation or top banner.
   - Use the **← / →** arrow keys or spacebar to present slide-by-slide.
   - Click the **"Open Interactive Platform Feature"** button on any slide to instantly launch and demonstrate that feature live to the audience!
2. **Interactive Live Demos**:
   - **AI Resume Parser**: Click "AI Resume Parser" in the top bar ➔ Click "Priya Sharma" ➔ Watch the extraction scan ➔ Review extracted skills ➔ Confirm sync.
   - **Skill Verification ("Prove It")**: Click "Verify New Skill" ➔ Start the Python or Machine Learning assessment ➔ Answer questions ➔ View instant score and cryptographic badge issuance.
   - **Career Simulator ("What If I Learn This Skill?")**: Go to "Career AI & Gaps" ➔ Select "Career Simulator" ➔ Click "+ Add: MLOps" and "+ Add: Cloud (AWS)" ➔ Watch alignment score, unlocked roles, and salary package jump in real time!
   - **Employer Portal & Explainability**: Switch to "Employer Portal" ➔ Review Priya Sharma's transparent scorecard (Python 88%, SQL 82%, Coding 84%) ➔ Adjust criteria sliders.
   - **University Intelligence**: Switch to "University Intelligence" ➔ Review the red alerts for outdated syllabus topics and recommended curriculum upgrades.
   - **Connected Skill Graph**: Switch to "Skill Graph & Market" ➔ Click on any node in the interactive network graph to inspect multi-hop relationships.

---

*TalentX — Your Skills. Your Network. Your Career. Your Future.*
