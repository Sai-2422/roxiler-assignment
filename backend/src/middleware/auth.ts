import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req as any).cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const data = verifyJwt(token);
    const user = await prisma.user.findUnique({ where: { id: (data as any).id } });
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    (req as any).user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
