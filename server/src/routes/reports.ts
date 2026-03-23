import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';

export const reportsRouter = Router();

/** GET /api/reports/weekly-summary?week=YYYY-WW */
reportsRouter.get('/weekly-summary', requireAuth, async (req: AuthedRequest, res) => {
  const week = String(req.query.week || '');
  const [year, weekNum] = week.split('-W').map(Number);
  const jan1 = new Date(year, 0, 1);
  const start = new Date(jan1.getTime() + (weekNum - 1) * 7 * 86400000);
  const end = new Date(start.getTime() + 6 * 86400000);

  const [metrics, logs, sessions] = await Promise.all([
    prisma.metric.findMany({ where: { userId: req.userId!, date: { gte: start, lte: end } } }),
    prisma.nutritionLog.findMany({ where: { userId: req.userId!, date: { gte: start, lte: end } } }),
    prisma.workoutSession.findMany({ where: { userId: req.userId!, date: { gte: start, lte: end } } })
  ]);

  res.json({
    week,
    generatedAt: new Date().toISOString(),
    safetyNotice:
      'Stop exercise for chest pain, severe dizziness, or shortness of breath. Consult your clinician. Not medical advice.',
    totals: {
      workouts: sessions.length,
      calories: logs.reduce((sum, l) => sum + l.calories, 0),
      avgWeight: metrics.length
        ? Number((metrics.reduce((sum, m) => sum + (m.weightKg || 0), 0) / metrics.length).toFixed(2))
        : null
    }
  });
});
