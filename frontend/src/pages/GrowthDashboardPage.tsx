import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { GrowthGarden } from '../components/growth/GrowthGarden';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';
import './GrowthDashboardPage.css';

const MONTHLY_BLOOM_SCORE = 300;

export function GrowthDashboardPage() {
  const growth = useAppStore((s) => s.growth);
  const name = useAppStore((s) => s.displayName);

  if (!growth) {
    return (
      <p className="muted" data-testid="growth-loading">
        성장 데이터를 불러오는 중…
      </p>
    );
  }

  const monthlyPct = Math.min(
    100,
    Math.round((growth.monthly.totalScore / MONTHLY_BLOOM_SCORE) * 100),
  );

  return (
    <div className="growth-page" data-testid="growth-dashboard">
      <header className="growth-page__head">
        <h2>성장 통합 대시보드</h2>
        <p className="muted">정원 풍경 — 중심 누적 나무와 월간 화분</p>
      </header>

      <div className="growth-page__layout">
        <GrowthGarden growth={growth} />

        <Card className="growth-page__profile" data-testid="growth-profile">
          <p className="growth-page__eyebrow">학습자 프로필</p>
          <h3 className="growth-page__name">{name || '학습자'}</h3>
          <div className="growth-page__points">
            ⭐ 누적 {growth.lifetime.totalScore.toLocaleString()}점
          </div>

          <div className="growth-page__progress">
            <div className="growth-page__progress-head">
              <span>이번 달 성장</span>
              <strong>{monthlyPct}%</strong>
            </div>
            <div className="quest-bar">
              <span style={{ width: `${monthlyPct}%` }} />
            </div>
            <p className="muted growth-page__hint">
              이번 달 화분: {stageLabel(growth.monthly.currentStage)} · 개화까지{' '}
              {Math.max(0, MONTHLY_BLOOM_SCORE - growth.monthly.totalScore)}점
            </p>
          </div>

          <div className="growth-page__links">
            <Link to="/growth/calendar" className="growth-page__link" data-testid="go-calendar">
              📅 성장 캘린더 자세히 보기 →
            </Link>
            <Link to="/mypage" className="growth-page__link" data-testid="go-collection">
              🏆 보관함에서 성취 보기 →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
