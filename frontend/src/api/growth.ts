import type { Goal, GrowthHistoryResponse, GrowthState, Milestone } from '@learners-high/shared';
import { apiClient } from './client';

export async function fetchGrowth(userId: string) {
  const { data } = await apiClient.get<GrowthState>(`/growth/${userId}`);
  return data;
}

export async function fetchMilestones(userId: string) {
  const { data } = await apiClient.get<Milestone[]>(`/milestones/${userId}`);
  return data;
}

export async function fetchGoals(userId: string) {
  const { data } = await apiClient.get<Goal[]>(`/goals/${userId}`);
  return data;
}

export async function fetchGrowthHistory(
  userId: string,
  from?: string,
  to?: string,
): Promise<GrowthHistoryResponse> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const query = params.toString() ? `?${params.toString()}` : '';
  const { data } = await apiClient.get<GrowthHistoryResponse>(`/growth/${userId}/history${query}`);
  return data;
}
