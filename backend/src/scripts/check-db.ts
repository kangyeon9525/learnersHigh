import mongoose from 'mongoose';
import { config } from '../config.js';

async function main() {
  console.log('[db-check] Connecting…');
  await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 30_000 });
  console.log('[db-check] Connected:', mongoose.connection.host, 'db:', mongoose.connection.name);
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection has no database handle');
  await db.admin().ping();
  console.log('[db-check] Ping OK');
  await mongoose.disconnect();
  console.log('[db-check] Success');
}

main().catch((err) => {
  console.error('[db-check] Failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
