import type { StudyPlan } from '@learners-high/shared';
import './PlanList.css';

interface Props {
  plans: StudyPlan[];
}

/** 당일 학습 계획 리스트 UI 셸 (P1.9). 드래그 핸들은 시각 표현만 (DnD는 P2.1.5) */
export function PlanList({ plans }: Props) {
  if (plans.length === 0) {
    return (
      <p className="plan-list__empty" data-testid="plan-list-empty">
        오늘 등록된 학습 계획이 없습니다.
      </p>
    );
  }

  return (
    <ul className="plan-list" data-testid="plan-list">
      {plans.map((plan) => {
        const [subject, ...rest] = plan.title.split(' · ');
        const detail = rest.join(' · ');
        return (
          <li
            key={plan.id}
            className={`plan-list__item${plan.completed ? ' plan-list__item--done' : ''}`}
            data-testid={`plan-${plan.id}`}
          >
            <span className="plan-list__check" aria-hidden>
              {plan.completed ? '✓' : ''}
            </span>
            <span className="plan-list__text">
              <strong>{subject}</strong>
              {detail ? <small>{detail}</small> : null}
            </span>
            {plan.durationMinutes ? (
              <span className="plan-list__duration">{plan.durationMinutes}분</span>
            ) : null}
            <span className="plan-list__handle" aria-hidden>
              ⠿
            </span>
          </li>
        );
      })}
    </ul>
  );
}
