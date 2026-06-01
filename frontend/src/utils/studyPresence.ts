import type { AttendanceRecord, StudySession } from '@learners-high/shared';

/** 홈 학습 상태 배너용 (P1.3.2) */
export type StudyPresence = 'not_checked_in' | 'checked_in' | 'studying' | 'checked_out';

export function resolveStudyPresence(
  attendance: AttendanceRecord | null,
  activeSession: StudySession | null,
): StudyPresence {
  if (attendance?.status === 'checked_out') return 'checked_out';
  if (activeSession) return 'studying';
  if (attendance?.status === 'checked_in') return 'checked_in';
  return 'not_checked_in';
}

const LABELS: Record<StudyPresence, { title: string; hint: string }> = {
  not_checked_in: {
    title: '아직 입실하지 않았어요',
    hint: '체크인 후 학습 타이머를 이용할 수 있습니다.',
  },
  checked_in: {
    title: '입실 완료 · 학습 대기 중',
    hint: '학습을 시작하면 집중 모니터링이 켜집니다.',
  },
  studying: {
    title: '학습 진행 중',
    hint: '타이머 화면에서 학습을 이어가세요.',
  },
  checked_out: {
    title: '퇴실 완료',
    hint: '오늘도 수고하셨습니다. 데일리 리포트를 확인해 보세요.',
  },
};

export function studyPresenceLabel(presence: StudyPresence) {
  return LABELS[presence];
}
