import { config } from './config.js';
import { createApp } from './app.js';
import { connectDatabase } from './db/connection.js';

async function main() {
  await connectDatabase();
  const app = createApp();
  app.listen(config.port, () => {
    console.log(`[backend] API listening on http://127.0.0.1:${config.port}`);
  });
}

main().catch((err) => {
  console.error('[backend] Failed to start', err);
  process.exit(1);
});
