import type { BranchRanking, DailyReport, MonthlyReport } from '@learners-high/shared';
import { apiClient } from './client';

export async function fetchDailyReport(userId: string, date?: string): Promise<DailyReport> {
  const params = date ? `?date=${date}` : '';
  const { data } = await apiClient.get<DailyReport>(`/reports/daily/${userId}${params}`);
  return data;
}

export async function fetchMonthlyReport(userId: string, month?: string): Promise<MonthlyReport> {
  const params = month ? `?month=${month}` : '';
  const { data } = await apiClient.get<MonthlyReport>(`/reports/monthly/${userId}${params}`);
  return data;
}

export async function fetchBranchRanking(userId: string, branchId?: string, month?: string): Promise<BranchRanking> {
  const params = new URLSearchParams({ userId });
  if (branchId) params.set('branchId', branchId);
  if (month) params.set('month', month);
  const { data } = await apiClient.get<BranchRanking>(`/reports/ranking?${params.toString()}`);
  return data;
}
