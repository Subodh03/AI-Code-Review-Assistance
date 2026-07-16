# AI Code Review Assistant

A full-stack app that reviews source code in two stages:

1. **Static analysis** (Pylint for Python today; the service is written so ESLint or other
   linters can be plugged in per-language).
2. **AI review** via [OpenRouter](https://openrouter.ai) — bugs, code smells, naming,
   performance, security, and auto-generated documentation.

Results, complexity metrics (cyclomatic complexity, functions/classes/LOC), and full
review history are stored per user in PostgreSQL and shown in a dashboard.

## Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | React (Vite) + Tailwind CSS          |
| Backend        | Node.js + Express                    |
| Database       | PostgreSQL                           |
| Auth           | JWT (access token, bcrypt passwords) |
| AI Integration | OpenRouter API                       |
| Static Analysis| Pylint (Python), pluggable per language |

## Project layout

```
ai-code-review-assistant/
├── backend/     Express API, auth, static analysis + AI orchestration, Postgres
└── frontend/    React (Vite) dashboard, profile, code submission, review pages
```

## Getting started

### 1. Database

Create an empty Postgres database (the app creates the tables for you):

```bash
createdb code_review_assistant
```

Then, from the `backend` folder, once your `.env` is set up (see step 2), run:

```bash
npm run db:init
```

This runs `schema.sql` using the same `pg` library the app already depends on — no
`psql` CLI required, which is especially handy on Windows where `psql` often
isn't on PATH. It prints a clear error if it can't connect (wrong password,
Postgres not running, database doesn't exist yet, etc).

If you do have `psql` available and prefer it:

```bash
psql -U postgres -d code_review_assistant -f backend/src/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # fill in DB creds, JWT secret, OPENROUTER_API_KEY
npm install
npm run dev                # http://localhost:5000
```

Pylint must be installed and on PATH for Python static analysis:

```bash
pip install pylint --break-system-packages
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                 # http://localhost:5173
```

## What's implemented vs. stubbed

**Implemented (working logic, ready to run against a real DB/keys):**
- Signup / login / logout / JWT auth middleware / profile update (name, mobile, avatar)
- Paste-code and upload-file submission
- Pylint-based static analysis for `.py` files
- Complexity metrics (LOC, function count, class count, a cyclomatic-complexity
  approximation based on branching keywords)
- OpenRouter AI review call with a structured JSON-output prompt
- Review history: list, search, filter by severity/language, view detail, delete
- Dashboard UI with stats, severity breakdown, recent reviews (light "Clarity" theme:
  warm cream background, serif display headings, forest-teal accent)
- Profile page with a preset avatar picker (6 illustrated options, no external
  images/licensing concerns), photo upload, name, and mobile number

**Stubbed / left as clearly-marked TODOs (would need real infra to finish):**
- "Forgot password" only issues a reset token + logs it (needs an email provider,
  e.g. SendGrid/Nodemailer, wired into `sendResetEmail()`)
- GitHub repository import (routes/service left as a documented extension point)
- File storage for uploaded avatars is disk-based for local dev — swap for
  S3/Supabase Storage in production
- ESLint/JS static analysis path is stubbed next to the Pylint implementation

See inline `// TODO` comments in the relevant service files.
