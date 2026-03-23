import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';
import { computeSummary } from '../services/metrics';
import { parseCsv, sanitizeCsvBuffer, HealthCsvRow } from '../services/csv';

const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

export const healthRouter = Router();

/** POST /api/health/import-csv */
healthRouter.post('/import-csv', requireAuth, upload.single('file'), async (req: AuthedRequest, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });

  const text = sanitizeCsvBuffer(req.file.buffer);
  const rows = parseCsv<HealthCsvRow>(text);

  for (const row of rows) {
    await prisma.metric.upsert({
      where: { userId_date: { userId: req.userId!, date: new Date(row.date) } },
      update: {
        steps: Number(row.steps || 0),
        exerciseMinutes: Number(row.exercise_minutes || 0),
        calories: Number(row.calories || 0),
        protein: Number(row.protein || 0),
        restingHr: Number(row.resting_hr || 0),
        weightKg: row.weight_kg ? Number(row.weight_kg) : null,
        bodyFatPct: row.body_fat_pct ? Number(row.body_fat_pct) : null
      },
      create: {
        userId: req.userId!,
        date: new Date(row.date),
        steps: Number(row.steps || 0),
        exerciseMinutes: Number(row.exercise_minutes || 0),
        calories: Number(row.calories || 0),
        protein: Number(row.protein || 0),
        restingHr: Number(row.resting_hr || 0),
        weightKg: row.weight_kg ? Number(row.weight_kg) : null,
        bodyFatPct: row.body_fat_pct ? Number(row.body_fat_pct) : null
      }
    });
  }

  res.json({ imported: rows.length });
});

/** GET /api/health/summary?start=&end= */
healthRouter.get('/summary', requireAuth, async (req: AuthedRequest, res) => {
  const start = req.query.start ? new Date(String(req.query.start)) : new Date(Date.now() - 7 * 86400000);
  const end = req.query.end ? new Date(String(req.query.end)) : new Date();

  const [metrics, user] = await Promise.all([
    prisma.metric.findMany({
      where: { userId: req.userId!, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' }
    }),
    prisma.user.findUnique({ where: { id: req.userId! } })
  ]);

  res.json(computeSummary(metrics, user?.heightCm));
});
