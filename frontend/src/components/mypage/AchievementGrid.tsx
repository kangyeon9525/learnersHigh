import type { Goal, Milestone } from '@learners-high/shared';
import './AchievementGrid.css';

interface Props {
  milestones: Milestone[];
  goals: Goal[];
}

export function AchievementGrid({ milestones, goals }: Props) {
  return (
    <div className="achievement-grid" data-testid="achievement-grid">
      <section>
        <h3>성취 (업적)</h3>
        <div className="achievement-grid__tiles">
          {milestones.map((m) => (
            <article
              key={m.id}
              className={`tile${m.isAchieved ? ' tile--done' : ' tile--locked'}`}
              data-testid={`milestone-${m.id}`}
            >
              <strong>{m.title}</strong>
              <span>+{m.rewardScore}</span>
              <small>{m.isAchieved ? '달성' : '미달성'}</small>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h3>퀘스트 이력</h3>
        <ul className="achievement-grid__quests">
          {goals.map((g) => (
            <li key={g.id} data-testid={`goal-${g.id}`}>
              <span>{g.cycle}</span>
              <span>
                {g.currentValue}/{g.targetValue}분
              </span>
              <span>{g.isCompleted ? '완료' : '진행 중'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
