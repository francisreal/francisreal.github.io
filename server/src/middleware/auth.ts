import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../lib/auth';

export interface AuthedRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const userId = verifyToken(auth.replace('Bearer ', ''));
  if (!userId) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.userId = userId;
  next();
};
