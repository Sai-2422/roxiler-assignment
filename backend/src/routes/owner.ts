import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';

const prisma = new PrismaClient();
const router = Router();

router.use(requireAuth, requireRole('OWNER'));

router.get('/my-store/ratings', async (req, res) => {
  const user = (req as any).user;
  const store = await prisma.store.findFirst({ where: { ownerId: user.id } });
  if (!store) return res.json({ ratings: [], store: null });
  const ratings = await prisma.rating.findMany({
    where: { storeId: store.id },
    select: { stars: true, createdAt: true, user: { select: { id: true, name: true, email: true } } }
  });
  res.json({ store: { id: store.id, name: store.name }, ratings });
});

router.get('/my-store/average-rating', async (req, res) => {
  const user = (req as any).user;
  const store = await prisma.store.findFirst({ where: { ownerId: user.id } });
  if (!store) return res.json({ average: 0 });
  const agg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { stars: true } });
  res.json({ average: agg._avg.stars || 0 });
});

export default router;
