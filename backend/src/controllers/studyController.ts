import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as studyService from '../services/studyService.js';

const startSchema = z.object({
  userId: z.string().min(1),
  startedAt: z.string().min(1),
});

const endSchema = z.object({
  userId: z.string().min(1),
  sessionId: z.string().min(1),
  startedAt: z.string().min(1),
  endedAt: z.string().min(1),
  focusMinutes: z.number().min(0),
  satisfaction: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  progress: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  aiEvents: z
    .array(
      z.object({
        at: z.string(),
        status: z.enum(['focus', 'distracted']),
      }),
    )
    .optional(),
});

const aiEventSchema = z.object({
  sessionId: z.string().min(1),
  status: z.enum(['focus', 'distracted']),
});

export async function startSession(req: Request, res: Response, next: NextFunction) {
  try {
    const body = startSchema.parse(req.body);
    const session = await studyService.startSession(body);
    res.status(201).json(session);
  } catch (e) {
    next(e);
  }
}

export async function endSession(req: Request, res: Response, next: NextFunction) {
  try {
    const body = endSchema.parse(req.body);
    const result = await studyService.endSession(body);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function injectAiEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const body = aiEventSchema.parse(req.body);
    const result = await studyService.appendAiEvent(body.sessionId, body.status);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function getActiveSession(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const session = await studyService.getActiveSession(userId);
    res.json({ session });
  } catch (e) {
    next(e);
  }
}

const abandonSchema = z.object({
  userId: z.string().min(1),
});

export async function abandonSession(req: Request, res: Response, next: NextFunction) {
  try {
    const body = abandonSchema.parse(req.body);
    await studyService.abandonIncompleteSessions(body.userId);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
}
