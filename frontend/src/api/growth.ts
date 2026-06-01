import type { Goal, GrowthState, Milestone } from '@learners-high/shared';
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
