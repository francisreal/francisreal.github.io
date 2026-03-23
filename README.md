# TempoCoach

TempoCoach is a single-user, production-capable prototype for personal training and nutrition coaching.

## Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + TypeScript + Express
- **DB**: SQLite via Prisma
- **Tests**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Features implemented
- Local auth (`signup`, `login`) with JWT.
- Onboarding/profile capture (DOB, sex, height, starting weight/body-fat, commute, GLP-1 flag, equipment).
- Dashboard with weekly schedule, workout snapshot, and nutrition summary.
- Workout templates A/B/C and workout session logging.
- Progression endpoint with soreness gating + configurable increment values per exercise.
- Manual nutrition logging, nutrition targets, and CSV import.
- Health CSV import + summary metrics (BMI, fat mass, lean mass, target weight @ 18% body fat).
- Reports endpoint for weekly summary (PDF-ready JSON).
- Safety notice in settings/report flow.

## Repository layout
```
.
├── server
│   ├── prisma
│   ├── src
│   └── tests
├── web
│   └── src
├── docker-compose.yml
├── CHANGELOG.md
└── README.md
```

## Environment
Copy `.env.example` to `.env` at repository root:

```bash
cp .env.example .env
```

Required keys:
- `DATABASE_URL` (default `file:./dev.db`)
- `JWT_SECRET`
- `NODE_ENV`
- `PORT`
- `VITE_API_URL`

## Quick start
```bash
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

- API: `http://localhost:4000`
- Web: `http://localhost:5173`

## Testing
```bash
npm test
```

## API endpoints
All protected endpoints require `Authorization: Bearer <jwt>`.

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### User
- `GET /api/user/profile`
- `PUT /api/user/profile`

### Health
- `POST /api/health/import-csv` (multipart field `file`, max 2MB)
- `GET /api/health/summary?start=&end=`

### Workouts
- `GET /api/workouts/templates`
- `POST /api/workouts/sessions`
- `GET /api/workouts/progression`

### Nutrition
- `GET /api/nutrition/targets`
- `PUT /api/nutrition/targets`
- `POST /api/nutrition/log`
- `POST /api/nutrition/import-csv`

### Reports
- `GET /api/reports/weekly-summary?week=YYYY-WW`

## CSV format
Header required:
```csv
date,steps,exercise_minutes,calories,protein,resting_hr,weight_kg,body_fat_pct
```

Example row:
```csv
2026-03-18,4321,28,2050,115,56,72.18,26
```

## Developer workflow (Codex tasks)
1. Make focused changes in small commits.
2. Run targeted checks first (`npm run test --workspace server` / `web`).
3. Keep API routes documented with inline comments and keep integration placeholders explicit.
4. Update `CHANGELOG.md` for user-facing milestones.

## Progression rule testing guide
1. Log two sessions where top rep range is achieved in consecutive workouts.
2. Call `GET /api/workouts/progression`.
3. Verify `nextIncrementKg` is non-zero (unless soreness > 7).
4. Log soreness > 7 and verify `hold: true` and increment set to `0`.

## Integration placeholders
- `server/src/index.ts`: add webhook routes for real Bevel / HealthKit sync.
- `server/src/routes/health.ts`: expects normalized CSV shape and currently uses local parsing.
- `web/src/pages/ImportData.tsx`: direct upload flow ready for provider-specific imports.

## Safety notice
TempoCoach does not provide medical advice. Stop exercise for emergency symptoms (e.g., chest pain, severe dizziness, shortness of breath) and consult a clinician.
