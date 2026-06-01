import { Link } from 'react-router-dom';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';

export function HomePage() {
  const name = useAppStore((s) => s.displayName);
  const growth = useAppStore((s) => s.growth);

  return (
    <div data-testid="home-page">
      <h2>안녕하세요, {name || '학습자'}님</h2>
      <p className="muted">태블릿 가로 모드 · 집중 우선 학습 매니지먼트</p>
      <div className="card" style={{ marginTop: '1rem' }}>
        {growth ? (
          <p>
            현재 누적 나무: <strong>{stageLabel(growth.lifetime.currentStage)}</strong> (
            {growth.lifetime.totalScore}점)
          </p>
        ) : null}
        <Link to="/timer" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
          학습 시작하기
        </Link>
      </div>
    </div>
  );
}
