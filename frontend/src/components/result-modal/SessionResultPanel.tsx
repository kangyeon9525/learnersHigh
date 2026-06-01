import type { ReactNode } from 'react';
import type { StudySessionResult } from '@learners-high/shared';
import { stageLabel } from '../../utils/format';
import './SessionResultModal.css';

interface SessionResultPanelProps {
  result: StudySessionResult;
  onClose?: () => void;
  growthAction?: ReactNode;
}

/** 정산 모달 본문 — Storybook·테스트용 presentational 컴포넌트 */
export function SessionResultPanel({ result, onClose, growthAction }: SessionResultPanelProps) {
  return (
    <div className="result-modal-backdrop" data-testid="session-result-modal">
      <div className="result-modal card" role="dialog" aria-modal="true">
        <h2>학습 종료 정산</h2>
        <p className="result-modal__summary">
          순공 <strong>{result.focusMinutes}분</strong> · 획득 점수{' '}
          <strong>{result.earnedScore}</strong>
        </p>

        <section>
          <h3>새로 달성한 성취</h3>
          {result.newMilestones.length === 0 ? (
            <p className="muted">이번 세션 신규 성취 없음</p>
          ) : (
            <ul>
              {result.newMilestones.map((m) => (
                <li key={m.id}>
                  {m.title} (+{m.rewardScore})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3>완료한 퀘스트</h3>
          {result.completedGoals.length === 0 ? (
            <p className="muted">이번 세션 완료 퀘스트 없음</p>
          ) : (
            <ul>
              {result.completedGoals.map((g) => (
                <li key={g.id}>
                  {g.cycle} 목표 (+{g.rewardScore})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3>성장 변화</h3>
          <p>
            누적 나무: {stageLabel(result.growthDelta.lifetime.fromStage)} →{' '}
            {stageLabel(result.growthDelta.lifetime.toStage)}
          </p>
          <p>
            월간 화분: {stageLabel(result.growthDelta.monthly.fromStage)} →{' '}
            {stageLabel(result.growthDelta.monthly.toStage)}
          </p>
        </section>

        <div className="result-modal__actions">
          <button type="button" onClick={onClose}>
            닫기
          </button>
          {growthAction ?? (
            <button type="button" className="btn-primary" data-testid="go-growth">
              성장 보러가기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
