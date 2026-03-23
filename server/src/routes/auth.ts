import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { comparePassword, hashPassword, signToken } from '../lib/auth';

export const authRouter = Router();

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

/** POST /api/auth/signup */
authRouter.post('/signup', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { email, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already exists' });

  const user = await prisma.user.create({
    data: {
      email,
      hashedPassword: await hashPassword(password),
      nutritionTarget: { create: { calories: 2050, protein: 115 } }
    }
  });

  res.json({ token: signToken(user.id), userId: user.id });
});

/** POST /api/auth/login */
authRouter.post('/login', async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await comparePassword(parsed.data.password, user.hashedPassword);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: signToken(user.id), userId: user.id });
});
