import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';

let bearer = '';

beforeAll(async () => {
  const login = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
  bearer = `Bearer ${login.body.token}`;
});

test('computes weekly averages from seeded CSV', async () => {
  const csv = [
    'date,steps,exercise_minutes,calories,protein,resting_hr,weight_kg,body_fat_pct',
    '2026-03-17,4200,20,2000,110,56,72.20,26',
    '2026-03-18,4300,30,2050,115,55,72.18,26',
    '2026-03-19,4400,25,2100,120,56,72.10,25.9'
  ].join('\n');

  await request(app).post('/api/health/import-csv').set('Authorization', bearer).attach('file', Buffer.from(csv), 'h.csv');

  const res = await request(app)
    .get('/api/health/summary?start=2026-03-17&end=2026-03-19')
    .set('Authorization', bearer);

  expect(res.status).toBe(200);
  expect(res.body.averages.steps).toBe(4300);
  expect(res.body.averages.protein).toBe(115);

  const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
  expect(user).toBeTruthy();
});
