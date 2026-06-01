import type {
  EndStudySessionRequest,
  StartStudySessionRequest,
  StudySession,
  StudySessionResult,
} from '@learners-high/shared';
import { apiClient } from './client';

export async function fetchDemoUser() {
  const { data } = await apiClient.get('/users/demo');
  return data as { id: string; displayName: string; branchId: string };
}

export async function startStudySession(body: StartStudySessionRequest) {
  const { data } = await apiClient.post<StudySession>('/study/session/start', body);
  return data;
}

export async function endStudySession(
  body: EndStudySessionRequest & { sessionId: string },
) {
  const { data } = await apiClient.post<StudySessionResult>('/study/session/end', body);
  return data;
}

export async function abandonActiveSessions(userId: string) {
  await apiClient.post('/study/session/abandon', { userId });
}

export async function fetchActiveSession(userId: string) {
  const { data } = await apiClient.get<{ session: StudySession | null }>(
    `/study/session/active/${userId}`,
  );
  return data.session;
}

export async function injectAiEvent(sessionId: string, status: 'focus' | 'distracted') {
  const { data } = await apiClient.post<{
    session: StudySession;
    latestEvent: { at: string; status: 'focus' | 'distracted' };
  }>('/mock-ai/event', { sessionId, status });
  return data;
}
