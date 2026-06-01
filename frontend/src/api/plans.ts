import type { CreateStudyPlanRequest, StudyPlan, UpdateStudyPlanRequest } from '@learners-high/shared';
import { apiClient } from './client';

export async function fetchPlans(userId: string, plannedDate?: string) {
  const params: Record<string, string> = { userId };
  if (plannedDate) params.plannedDate = plannedDate;
  const { data } = await apiClient.get<StudyPlan[]>('/plans', { params });
  return data;
}

export async function createPlan(body: CreateStudyPlanRequest) {
  const { data } = await apiClient.post<StudyPlan>('/plans', body);
  return data;
}

export async function updatePlan(
  planId: string,
  userId: string,
  patch: UpdateStudyPlanRequest,
) {
  const { data } = await apiClient.patch<StudyPlan>(`/plans/${planId}`, { userId, ...patch });
  return data;
}

export async function deletePlan(planId: string, userId: string) {
  await apiClient.delete(`/plans/${planId}`, { params: { userId } });
}
