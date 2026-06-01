import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as focusMonitorService from '../services/focusMonitorService.js';
import { FOCUS_MONITOR_FRAMES } from '../config/focusMonitorCatalog.js';

export async function getState(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().min(1).parse(req.params.userId);
    const state = await focusMonitorService.getMonitorState(userId);
    res.json(state);
  } catch (e) {
    next(e);
  }
}

export async function getCatalog(_req: Request, res: Response) {
  res.json({ frames: FOCUS_MONITOR_FRAMES, isRecording: false as const });
}
