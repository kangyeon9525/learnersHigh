import type { ReactNode } from 'react';
import type { StudySessionResult } from '@learners-high/shared';
import { goalCycleLabel, stageBadgeLabel, stageLabel } from '../../utils/format';
import './SessionResultModal.css';

interface SessionResultPanelProps {
  result: StudySessionResult;
  onClose?: () => void;
  growthAction?: ReactNode;
  mypageAction?: ReactNode;
}

/** 정산 모달 본문 — 학습 종료 후에만 노출 (집중 보호). Storybook·테스트용 presentational */
export function SessionResultPanel({
  result,
  onClose,
  growthAction,
  mypageAction,
}: SessionResultPanelProps) {
  const { lifetime } = result.growthDelta;
  const hasMilestone = result.newMilestones.length > 0;
  const hasQuest = result.completedGoals.length > 0;
  const isEmpty = !hasMilestone && !hasQuest;
  const evolutionPct = 85; // TODO(P2.4): 서버 산정 다음 단계 진척률로 대체

  return (
    <div
      className="result-modal-backdrop"
      data-testid="session-result-modal"
      data-variant={isEmpty ? 'empty' : hasMilestone && hasQuest ? 'combined' : hasMilestone ? 'milestones' : hasQuest ? 'quests' : 'empty'}
    >
      <div className="result-modal" role="dialog" aria-modal="true" aria-labelledby="result-title">
        <h2 id="result-title" className="result-modal__title">
          오늘 학습 완료! 🎉
        </h2>
        <p className="result-modal__subtitle">
          {isEmpty
            ? `순공 ${result.focusMinutes}분, 꾸준함이 쌓이고 있어요. 오늘도 고생 많으셨습니다.`
            : '멋진 성장을 이뤄냈어요. 오늘 하루도 고생 많으셨습니다.'}
        </p>

        {hasMilestone && (
          <div className="result-row" data-testid="result-milestones">
            <span className="result-row__icon" aria-hidden>
              🏅
            </span>
            <span className="result-row__label">새 성취 달성</span>
            <span className="result-row__badge">{result.newMilestones[0].title}</span>
          </div>
        )}

        {hasQuest && (
          <div className="result-row" data-testid="result-quests">
            <span className="result-row__icon" aria-hidden>
              ✅
            </span>
            <span className="result-row__label">퀘스트 완료</span>
            <span className="result-row__badge">
              {goalCycleLabel(result.completedGoals[0].cycle)} 목표 달성
            </span>
          </div>
        )}

        <div className="result-row result-row--score">
          <span className="result-row__icon" aria-hidden>
            ⭐
          </span>
          <span className="result-row__label">획득 점수</span>
          <strong className="result-row__score">+{result.earnedScore}점</strong>
        </div>

        <div className="result-growth" data-testid="result-growth">
          <h3 className="result-growth__title">🌱 성장 변화</h3>
          <div className="result-growth__stages">
            <div className="result-growth__stage">
              <div className={`tree tree--stage-${lifetime.fromStage}`} />
              <small>{stageBadgeLabel(lifetime.fromStage)}</small>
            </div>
            <span className="result-growth__arrow" aria-hidden>
              →
            </span>
            <div className="result-growth__stage result-growth__stage--to">
              <div className={`tree tree--stage-${lifetime.toStage}`} />
              <small>{stageBadgeLabel(lifetime.toStage)}</small>
            </div>
          </div>
          <div className="result-growth__evolution">
            <div className="result-growth__evolution-head">
              <span>다음 성장까지</span>
              <strong>{evolutionPct}%</strong>
            </div>
            <div className="quest-bar">
              <span style={{ width: `${evolutionPct}%` }} />
            </div>
          </div>
          <p className="result-growth__delta muted">
            누적 나무 {stageLabel(lifetime.fromStage)} → {stageLabel(lifetime.toStage)} · 월간 화분{' '}
            {stageLabel(result.growthDelta.monthly.fromStage)} →{' '}
            {stageLabel(result.growthDelta.monthly.toStage)}
          </p>
        </div>

        <div className="result-modal__actions">
          {growthAction ?? (
            <button type="button" className="result-modal__cta" data-testid="go-growth">
              🌿 성장 정원 보러가기
            </button>
          )}
          {mypageAction ?? (
            <button type="button" className="result-modal__cta result-modal__cta--secondary" data-testid="go-mypage">
              🏅 마이페이지 보관함
            </button>
          )}
          <button type="button" className="result-modal__close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
