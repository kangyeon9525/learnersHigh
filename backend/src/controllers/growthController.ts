import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getOrCreateGrowthState } from '../services/growthService.js';
import { GoalModel, MilestoneModel } from '../db/models/index.js';
import { toGoalDto, toMilestoneDto } from '../db/mappers.js';

export async function getGrowth(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const growth = await getOrCreateGrowthState(userId);
    res.json(growth);
  } catch (e) {
    next(e);
  }
}

export async function getMilestones(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const docs = await MilestoneModel.find({ userId });
    res.json(docs.map(toMilestoneDto));
  } catch (e) {
    next(e);
  }
}

export async function getGoals(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const docs = await GoalModel.find({ userId });
    res.json(docs.map(toGoalDto));
  } catch (e) {
    next(e);
  }
}
