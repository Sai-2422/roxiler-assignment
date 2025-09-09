import 'dotenv/config';
import app from './app.js';
import { execSync } from 'child_process';

const port = Number(process.env.PORT || 4000);

async function start() {
  try {
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      execSync('npx prisma db push', { stdio: 'inherit' });
    } catch (e) {
      console.warn('Prisma push failed:', e);
    }
    try {
      execSync('node ./dist/seed-run-once.js', { stdio: 'inherit' });
    } catch (e) {
      console.warn('Seed run failed (may be already seeded):', e);
    }
    app.listen(port, '0.0.0.0', () => console.log(`API on http://0.0.0.0:${port}`));
  } catch (err) {
    console.error('Start error:', err);
    process.exit(1);
  }
}

start();
