import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as planService from '../services/planService.js';

const createSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  plannedDate: z.string().min(1),
  durationMinutes: z.number().positive().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  plannedDate: z.string().min(1).optional(),
  sortOrder: z.number().int().min(0).optional(),
  durationMinutes: z.number().positive().optional(),
  completed: z.boolean().optional(),
});

export async function listPlans(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().min(1).parse(req.query.userId);
    const plannedDate =
      typeof req.query.plannedDate === 'string' ? req.query.plannedDate : undefined;
    const plans = await planService.listPlans(userId, plannedDate);
    res.json(plans);
  } catch (e) {
    next(e);
  }
}

export async function createPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createSchema.parse(req.body);
    const plan = await planService.createPlan(body);
    res.status(201).json(plan);
  } catch (e) {
    next(e);
  }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const planId = z.string().min(1).parse(req.params.id);
    const parsed = updateSchema
      .extend({ userId: z.string().min(1) })
      .parse(req.body);
    const { userId, ...patch } = parsed;
    const plan = await planService.updatePlan(planId, userId, patch);
    res.json(plan);
  } catch (e) {
    next(e);
  }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction) {
  try {
    const planId = z.string().min(1).parse(req.params.id);
    const userId = z.string().min(1).parse(req.query.userId);
    await planService.deletePlan(planId, userId);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
