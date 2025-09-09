import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { signupSchema, passwordSchema, emailSchema } from '../validations/zodSchemas.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { setAuthCookie, clearAuthCookie, signJwt } from '../utils/jwt.js';

const prisma = new PrismaClient();
const router = Router();

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ errors: parsed.error.flatten() });
  const { name, email, address, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const user = await prisma.user.create({
    data: { name, email, address, passwordHash: await hashPassword(password), role: 'USER' },
    select: { id: true, email: true, role: true, name: true, address: true }
  });
  setAuthCookie(res, signJwt({ id: user.id, role: user.role }));
  res.json({ user });
});

router.post('/login', async (req, res) => {
  const emailParse = emailSchema.safeParse(req.body.email);
  const pwd = req.body.password;
  if (!emailParse.success || typeof pwd !== 'string') return res.status(422).json({ error: 'Invalid credentials' });
  const user = await prisma.user.findUnique({ where: { email: emailParse.data } });
  if (!user || !(await comparePassword(pwd, user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password' });
  setAuthCookie(res, signJwt({ id: user.id, role: user.role }));
  res.json({ user: { id: user.id, email: user.email, role: user.role, name: user.name, address: user.address } });
});

router.post('/logout', async (_req, res) => { clearAuthCookie(res); res.json({ ok: true }); });

router.post('/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success || typeof oldPassword !== 'string') return res.status(422).json({ error: 'Invalid input' });
  const token = (req as any).cookies?.token; if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const jwt = (await import('jsonwebtoken')).default;
  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const user = await prisma.user.findUnique({ where: { id: data.id } });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (!(await comparePassword(oldPassword, user.passwordHash))) return res.status(400).json({ error: 'Old password incorrect' });
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(newPassword) } });
    res.json({ ok: true });
  } catch { return res.status(401).json({ error: 'Unauthorized' }); }
});

export default router;
