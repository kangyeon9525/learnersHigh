import mongoose from 'mongoose';
import { config } from '../config.js';

mongoose.connection.on('connected', () => {
  console.log('[backend] MongoDB connected');
});
mongoose.connection.on('disconnected', () => {
  console.warn('[backend] MongoDB disconnected');
});
mongoose.connection.on('error', (err) => {
  console.error('[backend] MongoDB error:', err instanceof Error ? err.message : err);
});

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 10_000,
  });
}

/**
 * DB 연결을 백그라운드에서 재시도한다.
 * 서버는 포트를 먼저 열어 두므로(server.ts) 연결 실패가 프로세스를 죽이지 않는다.
 */
export async function connectWithRetry(attempt = 1): Promise<void> {
  try {
    await connectDatabase();
  } catch (err) {
    const delay = Math.min(30_000, 2_000 * attempt);
    console.error(
      `[backend] MongoDB 연결 실패 (시도 ${attempt}) — ${Math.round(delay / 1000)}s 후 재시도:`,
      err instanceof Error ? err.message : err,
    );
    setTimeout(() => void connectWithRetry(attempt + 1), delay);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
