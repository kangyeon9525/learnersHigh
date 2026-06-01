import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Milestone } from '@learners-high/shared';
import { Card } from '../components/ui/Card';
import { AchievementGrid } from '../components/mypage/AchievementGrid';
import { useAppStore } from '../stores/useAppStore';
import { goalCycleLabel, stageLabel } from '../utils/format';
import './MyPage.css';

type MyTab = 'achievements' | 'quests' | 'growth';

const TABS: { id: MyTab; label: string }[] = [
  { id: 'achievements', label: '성취' },
  { id: 'quests', label: '퀘스트 이력' },
  { id: 'growth', label: '성장 기록' },
];

export function MyPage() {
  const milestones = useAppStore((s) => s.milestones);
  const goals = useAppStore((s) => s.goals);
  const growth = useAppStore((s) => s.growth);
  const [tab, setTab] = useState<MyTab>('achievements');
  const [selected, setSelected] = useState<Milestone | null>(null);

  const achievedCount = milestones.filter((m) => m.isAchieved).length;

  return (
    <div className="mypage" data-testid="mypage">
      <header className="mypage__head">
        <div>
          <h2>마이페이지 · 성취·성장 보관함</h2>
          {growth ? (
            <p className="muted">
              누적 {stageLabel(growth.lifetime.currentStage)} · 이번 달{' '}
              {stageLabel(growth.monthly.currentStage)} · 달성 성취 {achievedCount}개
            </p>
          ) : null}
        </div>
        <div className="mypage__hub">
          <Link to="/growth" className="mypage__link" data-testid="go-growth-dashboard">
            성장 통합 대시보드 →
          </Link>
          <Link to="/growth/calendar" className="mypage__link" data-testid="mypage-hub-calendar">
            성장 캘린더 →
          </Link>
        </div>
      </header>

      <div className="mypage__tabs" role="tablist" aria-label="보관함 탭">
        {TABS.map((t) => (
          <button
            type="button"
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`mypage__tab${tab === t.id ? ' mypage__tab--active' : ''}`}
            onClick={() => setTab(t.id)}
            data-testid={`mypage-tab-${t.id}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'achievements' && (
        <>
          <AchievementGrid
            milestones={milestones}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
          {selected ? (
            <Card className="mypage__detail" data-testid="achievement-detail">
              <div className="mypage__detail-head">
                <span className="mypage__detail-icon" aria-hidden>
                  {selected.isAchieved ? '🏅' : '🔒'}
                </span>
                <div>
                  <h3>{selected.title}</h3>
                  <small className="muted">
                    {selected.isAchieved
                      ? `달성: ${selected.achievedAt?.slice(0, 10) ?? '-'}`
                      : '미달성 — 조건 충족 시 학습 종료 정산에서 안내됩니다.'}
                  </small>
                </div>
                <button
                  type="button"
                  className="mypage__detail-close"
                  onClick={() => setSelected(null)}
                  aria-label="상세 닫기"
                >
                  ×
                </button>
              </div>
              <div className="mypage__detail-body">
                <div>
                  <p className="mypage__detail-label">조건 코드</p>
                  <p>{selected.conditionCode}</p>
                </div>
                <div>
                  <p className="mypage__detail-label">보상 점수</p>
                  <p>+{selected.rewardScore}점</p>
                </div>
              </div>
            </Card>
          ) : (
            <p className="muted mypage__hint">성취 배지를 선택하면 상세를 볼 수 있습니다.</p>
          )}
        </>
      )}

      {tab === 'quests' && (
        <Card data-testid="mypage-quests">
          {goals.length === 0 ? (
            <p className="muted">완료한 퀘스트 이력이 없습니다.</p>
          ) : (
            <ul className="mypage__quests">
              {goals.map((g) => (
                <li key={g.id} data-testid={`quest-${g.id}`}>
                  <span className="mypage__quest-cycle">{goalCycleLabel(g.cycle)}</span>
                  <span>
                    {g.currentValue}/{g.targetValue}분
                  </span>
                  <span>+{g.rewardScore}점</span>
                  <span className={g.isCompleted ? 'mypage__quest-done' : 'muted'}>
                    {g.isCompleted ? '완료' : '진행 중'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {tab === 'growth' && (
        <Card data-testid="mypage-growth">
          {growth ? (
            <ul className="mypage__growth">
              <li>
                <span>누적 나무</span>
                <strong>
                  {stageLabel(growth.lifetime.currentStage)} ({growth.lifetime.totalScore}점)
                </strong>
              </li>
              <li>
                <span>이번 달 화분</span>
                <strong>
                  {stageLabel(growth.monthly.currentStage)} ({growth.monthly.totalScore}점)
                </strong>
              </li>
              <li>
                <Link to="/growth/calendar" data-testid="mypage-go-calendar">
                  성장 캘린더 자세히 보기 →
                </Link>
              </li>
            </ul>
          ) : (
            <p className="muted">성장 데이터를 불러오는 중…</p>
          )}
        </Card>
      )}
    </div>
  );
}
