import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { ratingSchema } from '../validations/zodSchemas.js';

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth);

router.get('/stores', async (req, res) => {
  const { name = '', address = '', sort = 'name', order = 'asc' } = req.query as any;
  const user = (req as any).user;
  const stores = await prisma.store.findMany({
    where: {
      AND: [
        { name: { contains: name, mode: 'insensitive' } },
        { address: { contains: address, mode: 'insensitive' } }
      ]
    },
    orderBy: { [String(sort)]: String(order) === 'desc' ? 'desc' : 'asc' },
    select: { id: true, name: true, address: true }
  });
  const result = await Promise.all(stores.map(async s => {
    const agg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { stars: true } });
    const my = await prisma.rating.findUnique({ where: { userId_storeId: { userId: user.id, storeId: s.id } } });
    return { ...s, overall_rating: agg._avg.stars || 0, my_rating: my?.stars ?? null };
  }));
  res.json({ stores: result });
});

router.get('/stores/:id', async (req, res) => {
  const user = (req as any).user;
  const store = await prisma.store.findUnique({ where: { id: req.params.id } });
  if (!store) return res.status(404).json({ error: 'Not found' });
  const agg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { stars: true } });
  const my = await prisma.rating.findUnique({ where: { userId_storeId: { userId: user.id, storeId: store.id } } });
  res.json({ ...store, overall_rating: agg._avg.stars || 0, my_rating: my?.stars ?? null });
});

router.post('/stores/:id/ratings', async (req, res) => {
  const user = (req as any).user;
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });
  const store = await prisma.store.findUnique({ where: { id: req.params.id } });
  if (!store) return res.status(404).json({ error: 'Store not found' });
  const existing = await prisma.rating.findUnique({ where: { userId_storeId: { userId: user.id, storeId: store.id } } });
  if (existing) return res.status(400).json({ error: 'You have already rated this store. Use PATCH to modify.' });
  const rating = await prisma.rating.create({ data: { userId: user.id, storeId: store.id, stars: parsed.data.stars } });
  res.status(201).json({ rating });
});

router.patch('/stores/:id/ratings', async (req, res) => {
  const user = (req as any).user;
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });
  const updated = await prisma.rating.update({ where: { userId_storeId: { userId: user.id, storeId: req.params.id } }, data: { stars: parsed.data.stars } });
  res.json({ rating: updated });
});

export default router;
