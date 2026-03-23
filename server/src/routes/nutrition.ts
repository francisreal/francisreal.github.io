import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';
import { parseCsv, sanitizeCsvBuffer } from '../services/csv';

const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } });

export const nutritionRouter = Router();

/** GET /api/nutrition/targets */
nutritionRouter.get('/targets', requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.nutritionTarget.findUnique({ where: { userId: req.userId! } });
  res.json(target);
});

/** PUT /api/nutrition/targets */
nutritionRouter.put('/targets', requireAuth, async (req: AuthedRequest, res) => {
  const updated = await prisma.nutritionTarget.upsert({
    where: { userId: req.userId! },
    update: req.body,
    create: { userId: req.userId!, calories: 2050, protein: 115, ...req.body }
  });
  res.json(updated);
});

/** POST /api/nutrition/log */
nutritionRouter.post('/log', requireAuth, async (req: AuthedRequest, res) => {
  const log = await prisma.nutritionLog.upsert({
    where: { userId_date: { userId: req.userId!, date: new Date(req.body.date) } },
    update: req.body,
    create: { ...req.body, userId: req.userId!, date: new Date(req.body.date), source: 'manual' }
  });
  res.status(201).json(log);
});

/** POST /api/nutrition/import-csv */
nutritionRouter.post('/import-csv', requireAuth, upload.single('file'), async (req: AuthedRequest, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });

  const text = sanitizeCsvBuffer(req.file.buffer);
  const rows = parseCsv<any>(text);

  for (const row of rows) {
    await prisma.nutritionLog.upsert({
      where: { userId_date: { userId: req.userId!, date: new Date(row.date) } },
      update: {
        calories: Number(row.calories || 0),
        protein: Number(row.protein || 0),
        carbs: Number(row.carbs || 0),
        fat: Number(row.fat || 0),
        source: 'csv'
      },
      create: {
        userId: req.userId!,
        date: new Date(row.date),
        calories: Number(row.calories || 0),
        protein: Number(row.protein || 0),
        carbs: Number(row.carbs || 0),
        fat: Number(row.fat || 0),
        source: 'csv'
      }
    });
  }

  res.json({ imported: rows.length });
});
