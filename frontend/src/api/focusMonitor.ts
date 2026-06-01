import type { FocusMonitorState } from '@learners-high/shared';
import { apiClient } from './client';

export async function fetchFocusMonitorState(userId: string) {
  const { data } = await apiClient.get<FocusMonitorState>(
    `/focus-monitor/state/${userId}`,
  );
  return data;
}
