import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as attendanceService from '../services/attendanceService.js';

const checkInSchema = z.object({
  userId: z.string().min(1),
  checkInAt: z.string().optional(),
});

const checkOutSchema = z.object({
  userId: z.string().min(1),
  purpose: z.enum(['continue_study', 'break', 'home', 'other']),
  checkOutAt: z.string().optional(),
});

export async function checkIn(req: Request, res: Response, next: NextFunction) {
  try {
    const body = checkInSchema.parse(req.body);
    const record = await attendanceService.checkIn(body);
    res.status(201).json(record);
  } catch (e) {
    next(e);
  }
}

export async function checkOut(req: Request, res: Response, next: NextFunction) {
  try {
    const body = checkOutSchema.parse(req.body);
    const result = await attendanceService.checkOut(body);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function getActive(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().min(1).parse(req.params.userId);
    const record = await attendanceService.getActiveAttendance(userId);
    res.json(record);
  } catch (e) {
    next(e);
  }
}
