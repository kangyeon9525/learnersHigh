import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { bootstrapApp } from '../../utils/bootstrap';
import { useAppStore } from '../../stores/useAppStore';
import { SessionResultModal } from '../result-modal/SessionResultModal';
import { NavIcon, type NavIconName } from './NavIcon';
import './AppShell.css';

interface NavItem {
  to: string;
  label: string;
  icon: NavIconName;
  testId: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: '홈', icon: 'home', testId: 'nav-home' },
  { to: '/timer', label: '학습', icon: 'timer', testId: 'nav-timer' },
  { to: '/growth', label: '성장 정원', icon: 'growth', testId: 'nav-growth' },
  { to: '/mypage', label: '마이', icon: 'mypage', testId: 'nav-mypage' },
  { to: '/report', label: '데일리 리포트', icon: 'report', testId: 'nav-report' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dataSource = useAppStore((s) => s.dataSource);
  const navigate = useNavigate();

  useEffect(() => {
    bootstrapApp()
      .then(() => setReady(true))
      .catch((e) => setError(e instanceof Error ? e.message : '초기화 실패'));
  }, []);

  if (error) {
    return (
      <div className="app-shell app-shell--message" data-testid="app-error">
        <div>
          <p>초기화 실패: {error}</p>
          <p>
            MongoDB 실행 후 <code>npm run seed</code> 를 실행해 주세요.
          </p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="app-shell app-shell--message" data-testid="app-loading">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="app-shell__nav" data-testid="app-nav">
        <div className="app-shell__brand-block">
          <h1 className="app-shell__brand">러너스하이</h1>
          <p className="app-shell__tagline">오늘도 성장하세요</p>
        </div>

        <nav className="app-shell__links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              data-testid={item.testId}
              className={({ isActive }) =>
                `app-shell__link${isActive ? ' app-shell__link--active' : ''}`
              }
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="app-shell__cta"
          data-testid="nav-start-study"
          onClick={() => navigate('/timer')}
        >
          ▶ 학습 시작하기
        </button>
      </aside>

      <main className="app-shell__main">
        {dataSource === 'fixture' && (
          <div className="app-shell__fixture-banner" data-testid="fixture-banner">
            데모 데이터로 표시 중입니다. 실시간 데이터는 백엔드 연결 후 제공됩니다.
          </div>
        )}
        {children}
      </main>

      <SessionResultModal />
    </div>
  );
}
