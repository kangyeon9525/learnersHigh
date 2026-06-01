import type { GrowthState } from '@learners-high/shared';
import { monthShortLabel, stageLabel } from '../../utils/format';
import './GrowthGarden.css';

interface Props {
  growth: GrowthState;
}

interface StripItem {
  month: string;
  label: string;
  stage: number;
  isCurrent: boolean;
}

/**
 * 성장 통합 대시보드 정원 (P1.6).
 * 중심 누적 나무 + 하단 월간 화분 스트립(위성 오브젝트). 캘린더 드릴다운은 페이지에서 연결.
 */
export function GrowthGarden({ growth }: Props) {
  const strip: StripItem[] = [
    ...growth.monthly.archive
      .slice()
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((a) => ({ month: a.month, label: monthShortLabel(a.month), stage: a.finalStage, isCurrent: false })),
    {
      month: growth.monthly.currentMonth,
      label: monthShortLabel(growth.monthly.currentMonth),
      stage: growth.monthly.currentStage,
      isCurrent: true,
    },
  ];

  return (
    <div className="growth-garden" data-testid="growth-garden">
      <div className="growth-garden__scene">
        <span className="growth-garden__level" data-testid="growth-level">
          <strong>누적 {stageLabel(growth.lifetime.currentStage)}</strong>
          <small>{growth.lifetime.totalScore.toLocaleString()}점</small>
        </span>
        <div className="growth-garden__tree" data-testid="lifetime-tree">
          <div className={`tree tree--stage-${growth.lifetime.currentStage}`} />
        </div>
      </div>

      <ul className="growth-garden__strip" data-testid="monthly-strip">
        {strip.map((item) => (
          <li
            key={item.month}
            className={`growth-garden__pot${item.isCurrent ? ' growth-garden__pot--current' : ''}`}
            data-testid={`monthly-pot-${item.month}`}
            title={`${item.label} · ${stageLabel(item.stage)}`}
          >
            <div className={`plant plant--stage-${item.stage}`} />
            <span className="growth-garden__pot-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
