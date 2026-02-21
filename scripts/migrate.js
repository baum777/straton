#!/usr/bin/env node
/**
 * STRATON — Run DB migrations
 * Usage: DATABASE_URL=postgres://... node scripts/migrate.js
 * Or: npm run db:migrate
 */
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, '../db/migrations');

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}

async function run() {
  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  if (files.length === 0) {
    console.log('No migrations found');
    return;
  }
  console.log('Migrations:', files.join(', '));
  console.log('Run manually: psql $DATABASE_URL -f db/migrations/001_initial_schema.sql');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
