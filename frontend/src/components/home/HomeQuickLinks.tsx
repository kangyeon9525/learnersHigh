import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import './HomeQuickLinks.css';

/** P1.3.4 — 타이머·리포트·마이 빠른 진입 */
export function HomeQuickLinks() {
  const navigate = useNavigate();

  return (
    <nav className="home-quick-links" aria-label="빠른 이동" data-testid="home-quick-links">
      <Button
        variant="secondary"
        onClick={() => navigate('/timer')}
        data-testid="quick-timer"
      >
        ⏱ 학습 타이머
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate('/report')}
        data-testid="quick-report"
      >
        📊 데일리 리포트
      </Button>
      <Button
        variant="secondary"
        onClick={() => navigate('/mypage')}
        data-testid="quick-mypage"
      >
        🏅 마이페이지
      </Button>
    </nav>
  );
}
