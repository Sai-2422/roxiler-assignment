import fs from 'fs';
import { spawnSync } from 'child_process';

const marker = '/app/.seeded';

if (!fs.existsSync(marker)) {
  console.log('Running seed...');
  const r = spawnSync('node', ['./dist/seed.js'], { stdio: 'inherit' });
  fs.writeFileSync(marker, new Date().toISOString());
  console.log('Seed done. Exit code:', r.status);
} else {
  console.log('Seed already run, skipping.');
}
