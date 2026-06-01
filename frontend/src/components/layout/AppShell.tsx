import { useEffect, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { bootstrapApp } from '../../utils/bootstrap';
import { SessionResultModal } from '../result-modal/SessionResultModal';
import './AppShell.css';

const nav = [
  { to: '/', label: '홈' },
  { to: '/timer', label: '학습' },
  { to: '/growth', label: '성장 정원' },
  { to: '/mypage', label: '마이' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bootstrapApp()
      .then(() => setReady(true))
      .catch((e) => setError(e instanceof Error ? e.message : '초기화 실패'));
  }, []);

  if (error) {
    return (
      <div className="app-shell" data-testid="app-error">
        <p>API 연결 실패: {error}</p>
        <p>MongoDB 실행 후 <code>npm run seed</code> 를 실행해 주세요.</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="app-shell app-shell--loading" data-testid="app-loading">
        로딩 중…
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="app-shell__nav" data-testid="app-nav">
        <div>
          <h1 className="app-shell__brand">Learners High</h1>
          <p className="app-shell__tagline">Flourish today</p>
        </div>
        <nav>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-shell__link${isActive ? ' app-shell__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="app-shell__main">{children}</main>
      <SessionResultModal />
    </div>
  );
}
