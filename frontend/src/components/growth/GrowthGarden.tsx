import type { GrowthState } from '@learners-high/shared';
import { stageLabel } from '../../utils/format';
import './GrowthGarden.css';

interface Props {
  growth: GrowthState;
}

/** 성장 통합 대시보드 — 중앙 누적 나무 + 주변 월간 화분 */
export function GrowthGarden({ growth }: Props) {
  const archives = growth.monthly.archive;

  return (
    <div className="growth-garden" data-testid="growth-garden">
      <div className="growth-garden__scene">
        {archives.map((a) => (
          <div
            key={a.month}
            className="growth-garden__pot"
            data-testid={`monthly-pot-${a.month}`}
            title={`${a.month} · ${a.totalScore}점`}
          >
            <span className="growth-garden__pot-label">{a.month.slice(5)}월</span>
            <div className={`plant plant--stage-${a.finalStage}`} />
          </div>
        ))}
        <div className="growth-garden__tree" data-testid="lifetime-tree">
          <div className={`tree tree--stage-${growth.lifetime.currentStage}`} />
          <p>
            누적 나무 · {stageLabel(growth.lifetime.currentStage)} (
            {growth.lifetime.totalScore}점)
          </p>
        </div>
        <div className="growth-garden__current-pot" data-testid="current-monthly-pot">
          <div className={`plant plant--stage-${growth.monthly.currentStage}`} />
          <p>
            이번 달 화분 · {stageLabel(growth.monthly.currentStage)} (
            {growth.monthly.totalScore}점)
          </p>
        </div>
      </div>
    </div>
  );
}
