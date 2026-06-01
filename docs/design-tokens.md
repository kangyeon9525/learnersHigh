# design-tokens.md — 디자인 토큰 & 성장 에셋 매핑

> Figma Page 2 (`sanxzj25`)와 `frontend/src/styles/tokens.css` SSOT.  
> **2026-06-01** Talk-to-Figma import 반영 — Cloud Variables 확정 시 재동기화.

---

## 1. Color Tokens

| Token | CSS Variable | Figma 값 | 용도 |
|-------|--------------|----------|------|
| bg | `--color-bg` | `#fafaf8` | 앱 배경 |
| surface | `--color-surface` | `#ffffff` | 카드·모달 |
| primary | `--color-primary` | `#006d36` | CTA·브랜드 |
| primaryDark | `--color-primary-dark` | `#005e2d` | 브랜드 hover |
| primarySoft | `--color-primary-soft` | `#f0fdf4` | 보조 배경 |
| accent | `--color-accent` | `#4ade80` | 활성·강조 |
| text | `--color-text` | `#161d1f` | 본문 |
| textSecondary | `--color-text-secondary` | `#3d4a3e` | 부제 |
| muted | `--color-muted` | `#6d7b6d` | 보조 텍스트 |
| border | `--color-border` | `#bccabb` | 사이드바·구분선 |
| sidebar | `--color-sidebar` | `#f4fafd` | 좌측 네비 |
| warn | `--color-warn` | `#e76f51` | 이탈 경고 (코드 유지) |
| gardenSky | `--color-garden-sky` | `#b7e4c7` | 성장 정원 하늘 |
| gardenGround | `--color-garden-ground` | `#95d5b2` | 성장 정원 지면 |

**코드:** `frontend/src/styles/tokens.css`

---

## 2. Spacing & Radius

| Token | Variable | 값 |
|-------|----------|-----|
| xs | `--space-xs` | 4px |
| sm | `--space-sm` | 8px |
| md | `--space-md` | 16px |
| lg | `--space-lg` | 24px |
| xl | `--space-xl` | 32px |
| radius sm | `--radius-sm` | 10px |
| radius md | `--radius-md` | 16px |
| shadow card | `--shadow-card` | `0 8px 24px rgba(27,67,50,0.08)` |

---

## 3. Typography

| Token | Variable | 값 |
|-------|----------|-----|
| font brand | `--font-brand` | Quicksand, Pretendard, system-ui |
| font sans | `--font-sans` | Pretendard, Apple SD Gothic Neo, system-ui |

태블릿 가로 기준 — Figma Text Styles 정의 후 동기화.

---

## 4. 성장 단계 — 누적 나무 (Lifetime)

| Stage | 코드 | 라벨 | 점수 임계 (backend) | CSS class | Figma 에셋 |
|-------|------|------|---------------------|-----------|------------|
| 0 | `SEED` | 씨앗 | 0 | `.tree--stage-0` | _(Figma)_ |
| 1 | `SPROUT` | 새싹 | 100 | `.tree--stage-1` | |
| 2 | `SAPLING` | 묘목 | 300 | `.tree--stage-2` | |
| 3 | `TREE` | 나무 | 600 | `.tree--stage-3` | |
| 4 | `MASTER` | 성목 | 1000 | `.tree--stage-4` | |

임계값: `backend/src/services/growthService.ts` — Figma 확정 후 문서·코드 동시 갱신.

---

## 5. 성장 단계 — 월간 화분 (Monthly)

| Stage | 라벨 | 점수 임계 | CSS class |
|-------|------|-----------|-----------|
| 0 | 씨앗 | 0 | `.plant--stage-0` |
| 1 | 새싹 | 50 | `.plant--stage-1` |
| 2 | 줄기 | 120 | `.plant--stage-2` |
| 3 | 꽃봉오리 | 200 | `.plant--stage-3` |
| 4 | 개화 | 300 | `.plant--stage-4` |

---

## 6. 정산 모달 변형 (Storybook ↔ Figma)

| 변형 | Storybook | Figma Frame |
|------|-----------|-------------|
| 획득 없음 | `ResultModal/Empty` | `04-Result-Modal/Empty` |
| 성취만 | `MilestonesOnly` | `.../Milestone` |
| 퀘스트만 | `QuestsOnly` | `.../Quest` |
| 복합 | `Combined` | `.../Combined` |

---

## 7. Figma 동기화 절차

1. Figma Variables 업데이트
2. Agent + Figma MCP로 값 export 또는 수동 복사
3. `tokens.css` + 본 문서 테이블 갱신
4. Storybook Tablet Landscape에서 visual check

[figma-workflow.md](./figma-workflow.md) 참고.
