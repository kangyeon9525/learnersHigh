import type { AttendanceRecord, CheckInRequest, CheckInResponse, CheckOutRequest } from '@learners-high/shared';
import { apiClient } from './client';

export async function checkIn(body: CheckInRequest) {
  const { data } = await apiClient.post<CheckInResponse>('/attendance/check-in', body);
  return data;
}

export async function checkOut(body: CheckOutRequest) {
  const { data } = await apiClient.post<{ record: AttendanceRecord; reportSent: boolean }>(
    '/attendance/check-out',
    body,
  );
  return data;
}

export async function fetchActiveAttendance(userId: string) {
  const { data } = await apiClient.get<AttendanceRecord | null>(
    `/attendance/active/${userId}`,
  );
  return data;
}
