import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Express } from 'express';

let app: Express | undefined;

async function getApp(): Promise<Express> {
  if (app) return app;

  const { createApp } = await import('../backend/dist/app.js');
  const { connectDatabase } = await import('../backend/dist/db/connection.js');

  app = createApp();
  await connectDatabase().catch((err) => {
    console.error('[api] MongoDB connect failed:', err instanceof Error ? err.message : err);
  });

  return app;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const expressApp = await getApp();
  expressApp(req, res);
}
