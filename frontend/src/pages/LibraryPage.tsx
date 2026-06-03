import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { LibraryCategory, LibraryItem } from '@learners-high/shared';
import { Card } from '../components/ui/Card';
import { CoachingModal } from '../components/coaching/CoachingModal';
import { demoLibraryItems } from '../fixtures/demo-data';
import { useAppStore } from '../stores/useAppStore';
import './LibraryPage.css';

const TABS: { id: LibraryCategory; label: string }[] = [
  { id: 'study', label: '학습 자료' },
  { id: 'class', label: '수업' },
  { id: 'life', label: '생활' },
];

const CATEGORY_ICONS: Record<LibraryCategory, string> = {
  study: '📖',
  class: '🎓',
  life: '🌿',
};

interface LibraryCardProps {
  item: LibraryItem;
  tab: LibraryCategory;
}

function LibraryCard({ item, tab }: LibraryCardProps) {
  const isClass = tab === 'class';

  return (
    <Card className="library__card" data-testid={`library-item-${item.id}`}>
      <div className="library__card-body">
        <span className="library__card-icon" aria-hidden>
          {CATEGORY_ICONS[item.category]}
        </span>
        <div className="library__card-content">
          <h3 className="library__card-title">{item.title}</h3>
          <p className="library__card-desc muted">{item.description}</p>
          <div className="library__card-tags">
            {item.tags.map((tag) => (
              <span key={tag} className="library__tag">#{tag}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="library__card-actions">
        {item.linkedUrl && (
          <a
            href={item.linkedUrl}
            className="library__link-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.preventDefault()}
            data-testid={`library-link-${item.id}`}
          >
            자료 보기
          </a>
        )}
        {isClass ? (
          <button
            type="button"
            className="library__timer-btn library__timer-btn--disabled"
            disabled
            title="수업 항목은 타이머 직접 시작이 불가합니다"
            data-testid={`library-timer-disabled-${item.id}`}
          >
            수업 시간 고정
          </button>
        ) : (
          <Link
            to="/timer"
            className="library__timer-btn"
            data-testid={`library-timer-${item.id}`}
          >
            타이머 시작 →
          </Link>
        )}
      </div>
    </Card>
  );
}

/** P4.3: 라이브러리 카테고리 필터 페이지 */
export function LibraryPage() {
  const [tab, setTab] = useState<LibraryCategory>('study');
  const [coachingOpen, setCoachingOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dataSource = useAppStore((s) => s.dataSource);

  const filtered = useMemo(() => {
    const base = demoLibraryItems.filter((item) => item.category === tab);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [tab, search]);

  const showTodayList = tab !== 'life';

  return (
    <div className="library" data-testid="library">
      <header className="library__head">
        <div>
          <p className="library__eyebrow">학습 라이브러리</p>
          <h2 className="library__title">자료 & 일정 찾기</h2>
        </div>
        <button
          type="button"
          className="library__coaching-btn"
          onClick={() => setCoachingOpen(true)}
          data-testid="open-coaching"
        >
          코칭 클래스 예약
        </button>
      </header>

      {dataSource === 'fixture' && (
        <p className="muted library__fixture-note">
          데모 자료입니다. 실제 자료는 백엔드 연결 후 제공됩니다.
        </p>
      )}

      {/* 탭 */}
      <div className="library__tabs" role="tablist" aria-label="라이브러리 카테고리">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`library__tab${tab === t.id ? ' library__tab--active' : ''}`}
            onClick={() => { setTab(t.id); setSearch(''); }}
            data-testid={`library-tab-${t.id}`}
          >
            {CATEGORY_ICONS[t.id]} {t.label}
          </button>
        ))}
      </div>

      {/* 수업 탭 안내 배너 */}
      {tab === 'class' && (
        <div className="library__class-notice" role="note" data-testid="library-class-notice">
          수업 항목은 정해진 수업 시간에 참여합니다. 타이머 직접 선택이 제한됩니다.
        </div>
      )}

      {/* 오늘의 학습 리스트 — 생활 탭에서는 미표시 */}
      {showTodayList && (
        <Card className="library__today" data-testid="library-today-list">
          <p className="library__today-label">오늘의 학습 리스트</p>
          <ul className="library__today-items">
            <li>수학 · 4장 미적분 — 90분</li>
            <li>영어 · 어휘 연습 — 45분</li>
            <li>과학 · 세포 생물학 복습 — 60분</li>
          </ul>
        </Card>
      )}

      {/* 검색 */}
      <div className="library__search-wrap">
        <input
          type="search"
          className="library__search"
          placeholder="제목, 설명, 태그 검색…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="라이브러리 검색"
          data-testid="library-search"
        />
      </div>

      {/* 자료 그리드 */}
      {filtered.length === 0 ? (
        <p className="muted library__empty" data-testid="library-empty">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="library__grid" data-testid="library-grid">
          {filtered.map((item) => (
            <LibraryCard key={item.id} item={item} tab={tab} />
          ))}
        </div>
      )}

      <CoachingModal open={coachingOpen} onClose={() => setCoachingOpen(false)} />
    </div>
  );
}
