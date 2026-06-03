import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getBranchRanking, getDailyReport, getMonthlyReport } from '../services/reportService.js';

export async function getDailyReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const date = z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .parse(req.query.date as string | undefined);

    const today = new Date().toISOString().slice(0, 10);
    const report = await getDailyReport(userId, date ?? today);
    res.json(report);
  } catch (e) {
    next(e);
  }
}

export async function getMonthlyReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.params.userId);
    const month = z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional()
      .parse(req.query.month as string | undefined);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const report = await getMonthlyReport(userId, month ?? currentMonth);
    res.json(report);
  } catch (e) {
    next(e);
  }
}

export async function getRankingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = z.string().parse(req.query.userId as string);
    const branchId = z.string().default('gangnam').parse(req.query.branchId as string | undefined);
    const month = z
      .string()
      .regex(/^\d{4}-\d{2}$/)
      .optional()
      .parse(req.query.month as string | undefined);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const ranking = await getBranchRanking(userId, branchId, month ?? currentMonth);
    res.json(ranking);
  } catch (e) {
    next(e);
  }
}
