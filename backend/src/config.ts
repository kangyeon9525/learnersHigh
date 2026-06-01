import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/learners_high',
  mockAiEnabled: process.env.MOCK_AI_ENABLED !== 'false',
  mockAiIntervalMs: Number(process.env.MOCK_AI_INTERVAL_MS ?? 30_000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
};
