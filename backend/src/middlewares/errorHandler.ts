import type { NextFunction, Request, Response } from 'express';

function isCastError(err: unknown): err is { name: string; path?: string } {
  return !!err && typeof err === 'object' && (err as { name?: string }).name === 'CastError';
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // 잘못된 형식의 식별자(ObjectId 캐스팅 실패 등)는 클라이언트 오류(400)로 조용히 처리한다.
  if (isCastError(err)) {
    res.status(400).json({ error: 'invalid_id' });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal Server Error';
  const statusCode =
    err && typeof err === 'object' && 'statusCode' in err && typeof err.statusCode === 'number'
      ? err.statusCode
      : message.includes('not found')
        ? 404
        : 500;
  const status = statusCode;
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(status).json({ error: message });
}
