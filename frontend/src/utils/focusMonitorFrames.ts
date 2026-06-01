import type { FocusMonitorDisplayMode, FocusMonitorFrame, FocusMonitorState } from '@learners-high/shared';

/** 프레임 ID → 로컬 mock-AI 에셋 (항상 프론트 origin에서 로드) */
const LOCAL_FRAME_URLS: Record<string, string> = {
  'focus-desk-1': '/focus-monitor/focus-desk.svg',
  'focus-laptop-1': '/focus-monitor/focus-laptop.svg',
  'distracted-phone-1': '/focus-monitor/distracted-phone.svg',
  'distracted-away-1': '/focus-monitor/distracted-away.svg',
};

export function resolveMonitorImageUrl(frame: FocusMonitorFrame): string {
  return LOCAL_FRAME_URLS[frame.id] ?? frame.imageUrl ?? '/focus-monitor/focus-desk.svg';
}

export function pickLocalFrame(status: 'focus' | 'distracted', seed = 0): FocusMonitorFrame {
  const pool = Object.entries(LOCAL_FRAME_URLS)
    .filter(([id]) => (status === 'focus' ? id.startsWith('focus') : id.startsWith('distracted')))
    .map(([id, imageUrl]) => ({
      id,
      status,
      imageUrl,
      label:
        status === 'focus'
          ? id.includes('laptop')
            ? '노트북으로 집중 학습'
            : '책상에 앉아 학습 중'
          : id.includes('away')
            ? '자리를 비운 상태'
            : '시선이 화면에서 벗어남',
    }));
  return pool[seed % pool.length] ?? pool[0];
}

export function buildLocalMonitorState(
  displayMode: FocusMonitorDisplayMode,
  status: 'focus' | 'distracted' = 'focus',
  seed = 0,
): FocusMonitorState {
  const frame = pickLocalFrame(status, seed);
  return {
    active: true,
    displayMode,
    status,
    frame,
    isRecording: false,
    monitoringSince: new Date().toISOString(),
  };
}

/** 타이머 화면 모니터 표시 모드 (null이면 패널 숨김 — 사용하지 않음, 항상 표시 권장) */
export type TimerMonitorMode = FocusMonitorDisplayMode | 'unchecked';

/** 타이머 화면: 입실·세션·종료 힌트에 따라 모니터 UI 단계 결정 */
export function resolveTimerDisplayMode(
  checkedIn: boolean,
  hasActiveSession: boolean,
  endedHint: boolean,
): TimerMonitorMode {
  if (!checkedIn) return 'unchecked';
  if (endedHint) return 'ended';
  if (hasActiveSession) return 'live';
  return 'standby';
}
