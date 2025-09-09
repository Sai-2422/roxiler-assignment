import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import storeRoutes from './routes/stores.js';
import ownerRoutes from './routes/owner.js';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.set('trust proxy', 1);

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use('/api/auth', limiter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

export default app;
