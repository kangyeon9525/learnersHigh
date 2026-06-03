import { useEffect, useState } from 'react';
import type { BranchRanking } from '@learners-high/shared';
import { Card } from '../components/ui/Card';
import { PageState } from '../components/ui/PageState';
import { fetchBranchRanking } from '../api/reports';
import { useAppStore } from '../stores/useAppStore';
import { stageLabel } from '../utils/format';
import { demoBranchRanking } from '../fixtures/demo-data';
import './RankingPage.css';

function rankIcon(rank: number): string {
  if (rank === 1) return '🌳';
  if (rank === 2) return '🌿';
  if (rank === 3) return '🌱';
  return `${rank}.`;
}

/** P4.3: 지점 가상 순위 — 경쟁 강조 없이 학습 공동체 현황 표시 */
export function RankingPage() {
  const userId = useAppStore((s) => s.userId);
  const dataSource = useAppStore((s) => s.dataSource);

  const [ranking, setRanking] = useState<BranchRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    if (!userId || dataSource !== 'live') {
      setRanking(demoBranchRanking);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    fetchBranchRanking(userId, 'gangnam', currentMonth)
      .then((data) => {
        if (data.entries.length === 0) {
          setRanking(demoBranchRanking);
        } else {
          setRanking(data);
        }
      })
      .catch(() => {
        setRanking(demoBranchRanking);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [userId, dataSource, currentMonth]);

  if (loading) {
    return <PageState variant="loading" title="순위를 불러오는 중" testId="ranking-loading" />;
  }
  if (!ranking) {
    return <PageState variant="empty" title="순위 데이터가 없습니다" testId="ranking-empty" />;
  }

  const [y, m] = ranking.month.split('-');
  const monthLabel = `${y}년 ${Number(m)}월`;

  return (
    <div className="ranking" data-testid="ranking-page">
      <header className="ranking__head">
        <div>
          <p className="ranking__eyebrow">지점 학습 현황</p>
          <h2 className="ranking__title">{monthLabel} 함께 성장하기</h2>
          <p className="muted ranking__subtitle">
            순위는 학습 동기 부여를 위한 참고 지표입니다. 내 속도로 꾸준히 나아가는 것이 중요합니다.
          </p>
        </div>
        {ranking.currentUserRank !== undefined && (
          <div className="ranking__my-badge" data-testid="ranking-my-position">
            <span className="ranking__my-badge-label muted">내 순위</span>
            <strong className="ranking__my-badge-rank">{ranking.currentUserRank}위</strong>
          </div>
        )}
      </header>

      {error && (
        <p className="muted ranking__error">서버 연결 실패 — 데모 데이터를 표시합니다.</p>
      )}

      <Card className="ranking__card">
        <div className="ranking__list" role="list" data-testid="ranking-list">
          {/* 헤더 행 */}
          <div className="ranking__row ranking__row--header" role="row">
            <span className="ranking__col ranking__col--rank">순위</span>
            <span className="ranking__col ranking__col--name">이름</span>
            <span className="ranking__col ranking__col--stage">단계</span>
            <span className="ranking__col ranking__col--score">이번 달 점수</span>
          </div>

          {ranking.entries.map((entry) => (
            <div
              key={entry.userId}
              role="listitem"
              className={`ranking__row${entry.isCurrentUser ? ' ranking__row--me' : ''}`}
              data-testid={entry.isCurrentUser ? 'ranking-me' : `ranking-entry-${entry.rank}`}
            >
              <span className="ranking__col ranking__col--rank ranking__rank-icon">
                {rankIcon(entry.rank)}
              </span>
              <span className="ranking__col ranking__col--name">
                {entry.displayName}
                {entry.isCurrentUser && (
                  <span className="ranking__me-badge">나</span>
                )}
              </span>
              <span className="ranking__col ranking__col--stage muted">
                {stageLabel(entry.currentStage)}
              </span>
              <span className="ranking__col ranking__col--score">
                <strong className="ranking__score">{entry.monthlyScore.toLocaleString()}</strong>
                <span className="muted ranking__score-unit">점</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      <p className="ranking__note muted" data-testid="ranking-note">
        함께 공부하는 지점 학습 공동체 · 서로의 성장을 응원합니다 🌱
      </p>
    </div>
  );
}
