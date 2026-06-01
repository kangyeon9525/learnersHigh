import type { Goal, Milestone } from '@learners-high/shared';
import { goalCycleLabel } from '../../utils/format';
import './AchievementGrid.css';

interface Props {
  milestones: Milestone[];
  goals?: Goal[];
  selectedId?: string | null;
  onSelect?: (milestone: Milestone) => void;
}

function earnedLabel(achievedAt?: string): string {
  if (!achievedAt) return '';
  return new Date(achievedAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** 마이페이지 보관함 — 성취 배지 그리드 (선택 가능). 잠김/달성 시각 구분 */
export function AchievementGrid({ milestones, goals, selectedId, onSelect }: Props) {
  if (milestones.length === 0) {
    return (
      <p className="achievement-grid__empty" data-testid="achievement-empty">
        아직 표시할 성취가 없습니다.
      </p>
    );
  }

  return (
    <div className="achievement-grid" data-testid="achievement-grid">
      <div className="achievement-grid__tiles">
        {milestones.map((m) => (
          <button
            type="button"
            key={m.id}
            className={`tile${m.isAchieved ? ' tile--done' : ' tile--locked'}${
              selectedId === m.id ? ' tile--selected' : ''
            }`}
            data-testid={`milestone-${m.id}`}
            onClick={() => onSelect?.(m)}
            aria-pressed={selectedId === m.id}
          >
            <span className="tile__icon" aria-hidden>
              {m.isAchieved ? '🏅' : '🔒'}
            </span>
            <strong className="tile__title">{m.title}</strong>
            <small className="tile__meta">
              {m.isAchieved ? `획득: ${earnedLabel(m.achievedAt)}` : `+${m.rewardScore}점`}
            </small>
          </button>
        ))}
      </div>

      {goals && goals.length > 0 ? (
        <section className="achievement-grid__quests-section">
          <h3>퀘스트 이력</h3>
          <ul className="achievement-grid__quests">
            {goals.map((g) => (
              <li key={g.id} data-testid={`goal-${g.id}`}>
                <span>{goalCycleLabel(g.cycle)}</span>
                <span>
                  {g.currentValue}/{g.targetValue}분
                </span>
                <span>{g.isCompleted ? '완료' : '진행 중'}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
