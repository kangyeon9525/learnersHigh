import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { GrowthHistoryResponse } from '@learners-high/shared';
import { getOrCreateGrowthState } from '../services/growthService.js';
import { GoalModel, GrowthStateModel, MilestoneModel } from '../db/models/index.js';
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

export async function getGrowthHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const from = z.string().optional().parse(req.query.from as string | undefined);
    const to = z.string().optional().parse(req.query.to as string | undefined);

    const doc = await GrowthStateModel.findOne({ userId });
    if (!doc) {
      const empty: GrowthHistoryResponse = { userId, history: [], archive: [] };
      return res.json(empty);
    }

    let history = (doc.lifetime?.history ?? []).map((h) => ({
      date: h.date ?? '',
      scoreDelta: h.scoreDelta ?? 0,
      stage: h.stage ?? 0,
    }));

    if (from) history = history.filter((h) => h.date >= from);
    if (to) history = history.filter((h) => h.date <= to);

    const archive = (doc.monthly?.archive ?? []).map((a) => ({
      month: a.month ?? '',
      totalScore: a.totalScore ?? 0,
      finalStage: a.finalStage ?? 0,
    }));

    const response: GrowthHistoryResponse = { userId, history, archive };
    res.json(response);
  } catch (e) {
    next(e);
  }
}
