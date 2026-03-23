import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/lib/auth';

let token = '';

beforeAll(async () => {
  await prisma.nutritionLog.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.workoutTemplate.deleteMany();
  await prisma.nutritionTarget.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      hashedPassword: await hashPassword('password123'),
      heightCm: 172,
      nutritionTarget: { create: { calories: 2050, protein: 115 } }
    }
  });
  token = request(app)
    .post('/api/auth/login')
    .send({ email: user.email, password: 'password123' }) as unknown as string;
});

afterAll(async () => {
  await prisma.$disconnect();
});

const auth = async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
  return `Bearer ${res.body.token}`;
};

test('auth signup/login works', async () => {
  const signup = await request(app).post('/api/auth/signup').send({ email: 'new@example.com', password: 'secret12' });
  expect(signup.status).toBe(200);
  const login = await request(app).post('/api/auth/login').send({ email: 'new@example.com', password: 'secret12' });
  expect(login.body.token).toBeTruthy();
});

test('profile roundtrip', async () => {
  const bearer = await auth();
  const put = await request(app)
    .put('/api/user/profile')
    .set('Authorization', bearer)
    .send({ dob: '1990-01-01', glp1Flag: true, equipment: ['dumbbell'] });
  expect(put.status).toBe(200);
  const get = await request(app).get('/api/user/profile').set('Authorization', bearer);
  expect(get.body.glp1Flag).toBe(true);
});

test('health CSV import and summary', async () => {
  const bearer = await auth();
  const csv = 'date,steps,exercise_minutes,calories,protein,resting_hr,weight_kg,body_fat_pct\n2026-03-18,4321,28,2050,115,56,72.18,26';
  const up = await request(app).post('/api/health/import-csv').set('Authorization', bearer).attach('file', Buffer.from(csv), 'health.csv');
  expect(up.status).toBe(200);
  const summary = await request(app).get('/api/health/summary').set('Authorization', bearer);
  expect(summary.body.averages.steps).toBeGreaterThan(0);
  expect(summary.body.body.bmi).toBeGreaterThan(0);
});

test('workouts, nutrition, and reports endpoints', async () => {
  const bearer = await auth();
  const tpl = await prisma.workoutTemplate.create({ data: { code: 'T', name: 'Test' } });
  await request(app)
    .post('/api/workouts/sessions')
    .set('Authorization', bearer)
    .send({ templateId: tpl.id, date: '2026-03-20', setsData: [{ set: 1, reps: 5 }], completed: true });

  const targets = await request(app).get('/api/nutrition/targets').set('Authorization', bearer);
  expect(targets.status).toBe(200);

  await request(app)
    .post('/api/nutrition/log')
    .set('Authorization', bearer)
    .send({ date: '2026-03-20', calories: 2000, protein: 110, carbs: 200, fat: 60 });

  const progression = await request(app).get('/api/workouts/progression').set('Authorization', bearer);
  expect(progression.status).toBe(200);

  const report = await request(app).get('/api/reports/weekly-summary?week=2026-W12').set('Authorization', bearer);
  expect(report.status).toBe(200);
});
