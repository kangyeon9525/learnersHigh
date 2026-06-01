# component-spec.md — 공용 컴포넌트 스펙 (P0.1.3)

> Figma Page 2 · `design/figma-import/screens/` 기준. 코드: `frontend/src/components/`

---

## 디자인 시스템 매핑

| Figma / 역할 | React 컴포넌트 | Storybook |
|--------------|----------------|-----------|
| Primary CTA | `ui/Button` variant=`primary` | `UI/Button` |
| Secondary | `ui/Button` variant=`secondary` | `UI/Button` |
| 카드·위젯 | `ui/Card` | `UI/Card` |
| 일반 오버레이 | `ui/Modal` | `UI/Modal` |
| 학습 종료 정산 | `result-modal/SessionResultPanel` | `ResultModal/*` |
| 앱 레이아웃·네비 | `layout/AppShell` | _(페이지 E2E)_ |
| 타이머·집중 경고 | `pages/TimerPage` | _(P1)_ |
| 성장 정원 | `growth/GrowthGarden` | `Growth/GrowthGarden` |
| 마이 보관함 | `mypage/AchievementGrid` | `Mypage/AchievementGrid` |

---

## Button (`ui/Button`)

| Prop | 값 | 설명 |
|------|-----|------|
| `variant` | primary / secondary / ghost / danger | Figma CTA·보조·경고 |
| `size` | sm / md / lg | 터치 타겟 ≥ 44px (md 기준) |
| `loading` | boolean | 비동기 액션 |
| `disabled` | boolean | |

**토큰:** `--color-primary`, `--color-primary-dark`, `--color-warn`

---

## Card (`ui/Card`)

| Prop | 값 | 설명 |
|------|-----|------|
| `title` | string? | 카드 헤더 |
| `subtitle` | string? | 보조 설명 |
| `padding` | sm / md / lg | |

**토큰:** `--color-surface`, `--shadow-card`, `--radius-md`

---

## Modal (`ui/Modal`)

| Prop | 값 | 설명 |
|------|-----|------|
| `open` | boolean | 표시 여부 |
| `title` | string | `aria-labelledby` |
| `onClose` | fn? | Esc·백드롭 |

**정산 모달:** `SessionResultModal` + `SessionResultPanel` — 학습 중 미노출, 종료 시만.

---

## 정산 모달 변형 (P0.1.5)

| 변형 | Storybook | Figma Frame |
|------|-----------|-------------|
| 획득 없음 | `ResultModal/Empty` | Session Result Modal |
| 성취만 | `MilestonesOnly` | 동일 |
| 퀘스트만 | `QuestsOnly` | 동일 |
| 복합 | `Combined` | 동일 |

---

## 타이머 (P1 구현 예정)

- 스톱워치 / 카운트다운 모드
- `data-testid`: `timer-display`, `start-study`, `end-study`
- 이탈 시 `AlertBanner` 인라인 경고 (비차단). 이탈 중 집중 시간 미적립, 전체 경과 시간은 계속 (mock-ai 연동)
