import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';

export const workoutsRouter = Router();

/** GET /api/workouts/templates */
workoutsRouter.get('/templates', requireAuth, async (_req, res) => {
  const templates = await prisma.workoutTemplate.findMany({ include: { exercises: true } });
  res.json(templates);
});

/** POST /api/workouts/sessions */
workoutsRouter.post('/sessions', requireAuth, async (req: AuthedRequest, res) => {
  const session = await prisma.workoutSession.create({
    data: {
      userId: req.userId!,
      templateId: req.body.templateId,
      date: new Date(req.body.date || new Date()),
      notes: req.body.notes,
      soreness: req.body.soreness,
      completed: Boolean(req.body.completed),
      setsData: JSON.stringify(req.body.setsData || [])
    }
  });
  res.status(201).json(session);
});

/** GET /api/workouts/progression */
workoutsRouter.get('/progression', requireAuth, async (req: AuthedRequest, res) => {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId: req.userId! },
    orderBy: { date: 'desc' },
    take: 8
  });
  const templates = await prisma.workoutTemplate.findMany({ include: { exercises: true } });

  const sorenessHigh = sessions[0]?.soreness != null && sessions[0].soreness > 7;
  const suggestions = templates.flatMap((t) =>
    t.exercises.map((e) => ({
      exercise: e.name,
      hold: sorenessHigh,
      nextIncrementKg: sorenessHigh ? 0 : e.progressionIncrementKg,
      note: sorenessHigh
        ? 'Soreness above threshold, hold progression this session.'
        : 'Increase when top reps hit two sessions in a row.'
    }))
  );

  res.json({ volumeRampWeek: Math.min(4, sessions.length + 1), suggestions });
});
