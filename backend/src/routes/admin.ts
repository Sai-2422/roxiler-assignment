import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { createUserSchema, createStoreSchema } from '../validations/zodSchemas.js';

const prisma = new PrismaClient();
const router = Router();
router.use(requireAuth, requireRole('ADMIN'));

router.get('/metrics', async (_req, res) => {
  const [users, stores, ratings] = await Promise.all([prisma.user.count(), prisma.store.count(), prisma.rating.count()]);
  res.json({ users, stores, ratings });
});

router.post('/users', async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });
  const { name, email, address, password, role } = parsed.data;
  const bcrypt = (await import('bcryptjs')).default;
  const user = await prisma.user.create({
    data: { name, email, address, role, passwordHash: await bcrypt.hash(password, 10) },
    select: { id: true, name: true, email: true, address: true, role: true }
  });
  res.status(201).json({ user });
});

router.get('/users', async (req, res) => {
  const { query = '', role, sort = 'name', order = 'asc' } = req.query as any;
  const where: any = {
    AND: [{
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } }
      ]
    }]
  };
  if (role && ['ADMIN','USER','OWNER'].includes(role)) where.AND.push({ role });
  const users = await prisma.user.findMany({
    where,
    orderBy: { [String(sort)]: String(order) === 'desc' ? 'desc' : 'asc' },
    select: { id: true, name: true, email: true, address: true, role: true }
  });
  res.json({ users });
});

router.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, address: true, role: true }
  });
  if (!user) return res.status(404).json({ error: 'Not found' });
  let ownerRating: number | null = null;
  if (user.role === 'OWNER') {
    const store = await prisma.store.findFirst({ where: { ownerId: user.id } });
    if (store) {
      const agg = await prisma.rating.aggregate({ where: { storeId: store.id }, _avg: { stars: true } });
      ownerRating = (agg._avg.stars as number) || 0;
    }
  }
  res.json({ user, ownerRating });
});

router.get('/stores', async (req, res) => {
  const { query = '', sort = 'name', order = 'asc' } = req.query as any;
  const stores = await prisma.store.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { [String(sort)]: String(order) === 'desc' ? 'desc' : 'asc' },
    select: { id: true, name: true, email: true, address: true }
  });
  const result = await Promise.all(stores.map(async s => {
    const agg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { stars: true } });
    return { ...s, overall_rating: agg._avg.stars || 0 };
  }));
  res.json({ stores: result });
});

router.post('/stores', async (req, res) => {
  const parsed = createStoreSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });
  const data = await prisma.store.create({ data: parsed.data });
  res.status(201).json({ store: data });
});

export default router;
