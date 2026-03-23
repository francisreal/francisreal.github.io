import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthedRequest, requireAuth } from '../middleware/auth';

export const userRouter = Router();

const profileSchema = z.object({
  dob: z.string().optional(),
  sex: z.string().optional(),
  heightCm: z.number().optional(),
  startingWeight: z.number().optional(),
  bodyFatPct: z.number().optional(),
  commuteMiles: z.number().optional(),
  glp1Flag: z.boolean().optional(),
  equipment: z.array(z.string()).optional()
});

/** GET /api/user/profile */
userRouter.get('/profile', requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  res.json(user);
});

/** PUT /api/user/profile */
userRouter.put('/profile', requireAuth, async (req: AuthedRequest, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const data = parsed.data;
  const updated = await prisma.user.update({
    where: { id: req.userId! },
    data: {
      ...data,
      equipmentCsv: data.equipment?.join(',')
    }
  });
  res.json(updated);
});
