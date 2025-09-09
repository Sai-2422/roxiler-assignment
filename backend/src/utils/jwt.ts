import jwt from 'jsonwebtoken';
import { Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
const COOKIE_SECURE = String(process.env.COOKIE_SECURE || 'false') === 'true';

export function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', token, { httpOnly: true, secure: COOKIE_SECURE, sameSite: 'lax', path: '/', maxAge: 7*24*60*60*1000 });
}
export function clearAuthCookie(res: Response) {
  res.clearCookie('token', { path: '/' });
}
export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET) as any;
}
