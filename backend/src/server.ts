import { config } from './config.js';
import { createApp } from './app.js';
import { connectWithRetry, disconnectDatabase } from './db/connection.js';

function main() {
  const app = createApp();

  // 포트를 먼저 연다 → 프론트(Vite) 프록시가 ECONNREFUSED 대신 정상 응답을 받는다.
  const server = app.listen(config.port, () => {
    console.log(`[backend] API listening on http://127.0.0.1:${config.port}`);
  });

  // DB는 백그라운드에서 연결·재시도 (연결 전 요청은 mongoose가 버퍼링 후 처리/타임아웃).
  void connectWithRetry();

  const shutdown = (signal: string) => {
    console.log(`[backend] ${signal} 수신 — 종료합니다.`);
    server.close(() => {
      void disconnectDatabase().finally(() => process.exit(0));
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
