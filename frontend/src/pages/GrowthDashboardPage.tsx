import { Link } from 'react-router-dom';
import { GrowthGarden } from '../components/growth/GrowthGarden';
import { useAppStore } from '../stores/useAppStore';

export function GrowthDashboardPage() {
  const growth = useAppStore((s) => s.growth);

  if (!growth) {
    return <p>성장 데이터를 불러오는 중…</p>;
  }

  return (
    <div data-testid="growth-dashboard">
      <h2>성장 통합 대시보드</h2>
      <p className="muted">정원 풍경 — 누적 나무와 월간 화분</p>
      <GrowthGarden growth={growth} />
      <p style={{ marginTop: '1rem' }}>
        <Link to="/mypage">마이페이지 보관함 →</Link>
      </p>
    </div>
  );
}
