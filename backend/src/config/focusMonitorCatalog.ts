import type { AiFocusStatus, FocusMonitorFrame } from '@learners-high/shared';

/**
 * 집중 모니터링 프레임 카탈로그 (mock-AI 정적 프레임).
 * 실제 웹캠·녹화 없음. imageUrl은 프론트 public 에셋 경로만 사용한다.
 */
export const FOCUS_MONITOR_FRAMES: FocusMonitorFrame[] = [
  {
    id: 'focus-desk-1',
    status: 'focus',
    imageUrl: '/focus-monitor/focus-desk.svg',
    label: '책상에 앉아 학습 중',
  },
  {
    id: 'focus-laptop-1',
    status: 'focus',
    imageUrl: '/focus-monitor/focus-laptop.svg',
    label: '노트북으로 집중 학습',
  },
  {
    id: 'distracted-phone-1',
    status: 'distracted',
    imageUrl: '/focus-monitor/distracted-phone.svg',
    label: '시선이 화면에서 벗어남',
  },
  {
    id: 'distracted-away-1',
    status: 'distracted',
    imageUrl: '/focus-monitor/distracted-away.svg',
    label: '자리를 비운 상태',
  },
];

export function getFrameById(frameId: string): FocusMonitorFrame | undefined {
  return FOCUS_MONITOR_FRAMES.find((f) => f.id === frameId);
}

export function pickFrameForStatus(
  status: AiFocusStatus,
  seed = 0,
): FocusMonitorFrame {
  const pool = FOCUS_MONITOR_FRAMES.filter((f) => f.status === status);
  if (pool.length === 0) return FOCUS_MONITOR_FRAMES[0];
  return pool[seed % pool.length];
}
