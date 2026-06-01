import { useEffect, useState } from 'react';
import type { FocusMonitorState } from '@learners-high/shared';
import type { TimerMonitorMode } from '../../utils/focusMonitorFrames';
import { resolveMonitorImageUrl } from '../../utils/focusMonitorFrames';
import './WebcamMonitorPanel.css';

interface Props {
  displayMode: TimerMonitorMode;
  state: FocusMonitorState | null;
}

const STANDBY_MESSAGE: Record<string, string> = {
  unchecked: '홈에서 체크인하면 집중 모니터링이 활성화됩니다',
  standby: '학습을 시작하면 모니터링 화면이 켜집니다',
  ended: '학습이 종료되었습니다',
  live: '',
};

/**
 * 입실 후 웹캠 녹화처럼 보이는 집중 모니터 UI.
 * standby/ended: 검은 화면 · live: mock-AI 정적 프레임 (녹화·저장 없음)
 */
export function WebcamMonitorPanel({ displayMode, state }: Props) {
  const isLive = displayMode === 'live';
  const isStandbyLike = displayMode === 'standby' || displayMode === 'ended' || displayMode === 'unchecked';
  const statusLabel = state?.status === 'distracted' ? '이탈 감지' : '집중 중';
  const imageUrl = state ? resolveMonitorImageUrl(state.frame) : '';
  const frameId = state?.frame.id;

  // 프레임이 바뀔 때마다 로드 상태 초기화 (이미지 깨짐 시 안내 폴백 표시)
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [frameId]);

  return (
    <section
      className={`webcam-monitor webcam-monitor--${displayMode}`}
      data-testid="focus-monitor"
      data-display-mode={displayMode}
      aria-label="집중 모니터링 화면"
    >
      <div className="webcam-monitor__viewport">
        {isLive && state ? (
          <>
            {!imgError && (
              <img
                key={state.frame.id}
                className={`webcam-monitor__frame${imgLoaded ? ' is-loaded' : ''}`}
                src={imageUrl}
                alt={state.frame.label}
                loading="eager"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}
            {imgError && (
              <div
                className="webcam-monitor__standby"
                data-testid="focus-monitor-frame-error"
              >
                <span className="webcam-monitor__standby-icon" aria-hidden>
                  ●
                </span>
                <p>AI 분석 프레임을 불러오지 못했습니다</p>
              </div>
            )}
            <div className="webcam-monitor__scanline" aria-hidden />
            <div className="webcam-monitor__badges">
              <span className="webcam-monitor__rec" aria-hidden>
                <span className="webcam-monitor__rec-dot" />
                LIVE
              </span>
              <span
                className={`webcam-monitor__status webcam-monitor__status--${state.status}`}
                data-testid="focus-monitor-status"
              >
                {statusLabel}
              </span>
            </div>
          </>
        ) : isStandbyLike ? (
          <div className="webcam-monitor__standby" data-testid="focus-monitor-standby">
            <span className="webcam-monitor__standby-icon" aria-hidden>
              ●
            </span>
            <p>{STANDBY_MESSAGE[displayMode] ?? STANDBY_MESSAGE.standby}</p>
          </div>
        ) : null}
      </div>
      {isLive && state ? (
        <p className="webcam-monitor__caption muted">
          {state.frame.label} · 실제 녹화·영상 저장 없음 (AI 집중 분석용 표시만)
        </p>
      ) : (
        <p className="webcam-monitor__caption muted">카메라 대기 중 · 영상은 저장되지 않습니다</p>
      )}
    </section>
  );
}
