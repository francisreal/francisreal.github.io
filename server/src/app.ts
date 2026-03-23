import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { healthRouter } from './routes/health';
import { workoutsRouter } from './routes/workouts';
import { nutritionRouter } from './routes/nutrition';
import { reportsRouter } from './routes/reports';

export const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/healthcheck', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/health', healthRouter);
app.use('/api/workouts', workoutsRouter);
app.use('/api/nutrition', nutritionRouter);
app.use('/api/reports', reportsRouter);
