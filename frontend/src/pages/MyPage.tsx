import { Link } from 'react-router-dom';
import { AchievementGrid } from '../components/mypage/AchievementGrid';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';

export function MyPage() {
  const milestones = useAppStore((s) => s.milestones);
  const goals = useAppStore((s) => s.goals);
  const growth = useAppStore((s) => s.growth);

  return (
    <div data-testid="mypage">
      <h2>마이페이지 · 성취·성장 보관함</h2>
      {growth && (
        <p className="muted">
          누적 {stageLabel(growth.lifetime.currentStage)} / 이번 달{' '}
          {stageLabel(growth.monthly.currentStage)}
        </p>
      )}
      <AchievementGrid milestones={milestones} goals={goals} />
      <p style={{ marginTop: '1rem' }}>
        <Link to="/growth">성장 통합 대시보드로 이동 →</Link>
      </p>
    </div>
  );
}
