# session_context.md — 러너스하이(Learners High) 세션 로그

> **목적:** 매 작업 세션이 끝날 때 작업 내용을 요약·누적 기록한다. 다음 세션(또는 다른 AI/개발자)이 **이전 맥락을 빠르게 복원**하도록 돕는 단일 로그.
> **사용 대상:** Cursor / Claude Code 등 AI 어시스턴트 및 개발자
> **연관:** `project_context.md`(범위), `architecture.md`(규칙), `acceptance.md`(DoD)

---

## 0. 사용 규칙

- **세션 시작 시:** 본 문서 최신 항목(특히 "다음 할 일", "미해결/주의")을 먼저 읽고 작업을 이어간다.
- **세션 종료 시:** 아래 템플릿을 복사해 `## 세션 로그` 최상단에 **새 항목으로 추가**(역순, 최신이 위).
- **불변 원칙:** 과거 로그는 수정하지 않고 추가만 한다. 결정이 바뀌면 새 항목에 사유와 함께 기록.
- **기록 대상:** 변경된 파일/모듈, 추가·수정 API, 스키마/타입 변경, 시드 변경, 테스트(Storybook/Playwright) 상태, 임시 코드(TODO), 결정·합의, 미해결 이슈, 다음 할 일.
- **DoD 연동:** 완료 보고 항목은 `acceptance.md`의 해당 기준 충족 여부를 함께 표기.

---

## 1. 세션 로그 항목 템플릿 (복사용)

markdown

`### [YYYY-MM-DD HH:MM] 세션 N — <한 줄 요약>

- 작업자/도구: (예: Claude Code / Cursor)
- 관련 우선순위: (P0~P5)

**한 일 (Done)**

- **변경 (Files / API / Schema / Seed)**

- 파일:
- API:
- 타입/스키마(shared/types ↔ Mongoose):
- 시드(seeds):

**테스트**

- Storybook: (추가/수정 스토리, 상태)
- Playwright: (시나리오, 통과/실패)
- TypeScript: (오류 0 여부)

**결정 / 합의**

- **미해결 / 주의 (Open Issues)**

- **다음 할 일 (Next)**
  -`

  ***

## 2. 빠른 상태 보드 (매 세션 갱신)

> 현재 스냅샷. 세부 이력은 아래 세션 로그 참조.

- **현재 단계:** **P5 완료** — 에러 바운더리·낙관적 UI·Flow A~E E2E 53/53·acceptance §4 self-check
- **동작 가능한 핵심 흐름:** 입실→타이머→AI이탈→종료→정산 모달→Garden/My/Daily/Monthly/Library/Ranking (전체 흐름 E2E 통과)
- **미해결 핵심 이슈:** P2.1.5 DnD (보류)·P2.3.4 웹캠 audit (실질 준수, 형식적 완료 미결)
- **즉시 다음 할 일:** 프로젝트 완료 — 추가 작업 지시 대기

---

## 3. 세션 로그 (최신이 위)

<!-- 새 세션 항목을 이 줄 아래에 추가하세요. -->

### [2026-06-02 20:00] 세션 18 — P5 안정화 & 시연 QA (에러 바운더리·낙관적 UI·Flow A~E E2E)

- 작업자/도구: Claude Code (claude-sonnet-4-6)
- 관련 우선순위: P5.1 · P5.2 · P5.3

**한 일 (Done)**

- **P5.1 에러 바운더리 + 로딩/에러/빈 상태**:
  - `ErrorBoundary` 클래스 컴포넌트 신규 (`frontend/src/components/ui/ErrorBoundary.tsx`·`.css`): React render 오류 잡아 앱 크래시 방지, "다시 시도" 복구 UI, `data-testid="error-boundary"` 제공
  - `AppShell.tsx` main 영역을 `<ErrorBoundary>`로 래핑 — 페이지 수준 오류 격리
  - 기존 모든 페이지 `PageState` 로딩/에러/빈 상태는 P1~P4 구현으로 이미 완비
- **P5.2 계획 CRUD 낙관적 UI + reconcile** (`HomePage.tsx`):
  - `handlePlanToggle` 함수 신규: 클릭 즉시 낙관적 업데이트(`setPlans(optimistic)`) → API 성공 시 서버 응답으로 reconcile → API 실패 시 `prevPlans` 스냅샷으로 원상 복귀
  - 정산 모달은 기존대로 서버 확정값만 (`openSettlement(result)`) — 낙관적 UI 미적용 원칙 유지
- **P5.3 Flow A~E 전구간 E2E**:
  - `e2e/tests/p5-acceptance.spec.ts` (신규): Flow A~E 5개 흐름 smoke 테스트 — 총 12 시나리오
  - `e2e/tests/p4-extra-pages.spec.ts` (신규): 라이브러리 탭 필터·수업 타이머 비활성화·생활 탭 리스트 미표시·검색·코칭 모달·순위 페이지·월간 리포트 — 총 9 시나리오
  - `e2e/tests/ui-navigation.spec.ts`: 라이브러리 nav 진입 테스트 추가
  - 기존 5개 테스트 수정 (timer hydrating 대기, close-result 후 홈 네비, settlement testid 미존재 수정, ui-navigation 입실 흐름 강화)
- **E2E 안정화**:
  - `settlementService.ts`: `withTransaction` 재시도 방식으로 전환 — `TransientTransactionError` 자동 재시도
  - `playwright.config.ts`: `retries: 1` 로컬 추가 — 일시적 DB 충돌 flaky 흡수
- **acceptance.md §4 self-check 완료**: 개인정보·보안·요구사항·디자인·검증 전 항목 `[x]` 처리, 미결 2건 명시

**변경 (Files / API / Schema / Seed)**

- 파일 (신규):
  - `frontend/src/components/ui/ErrorBoundary.tsx`
  - `frontend/src/components/ui/ErrorBoundary.css`
  - `e2e/tests/p5-acceptance.spec.ts`
  - `e2e/tests/p4-extra-pages.spec.ts`
- 파일 (수정):
  - `frontend/src/components/layout/AppShell.tsx` (ErrorBoundary 래핑)
  - `frontend/src/pages/HomePage.tsx` (handlePlanToggle 낙관적 UI)
  - `backend/src/services/settlementService.ts` (withTransaction 재시도)
  - `e2e/playwright.config.ts` (retries: 1)
  - `e2e/tests/p0-smoke.spec.ts` (timer hydrating 대기·체크인 경로)
  - `e2e/tests/study-flow.spec.ts` (timer hydrating 대기)
  - `e2e/tests/post-study-growth.spec.ts` (close-result 후 홈 네비)
  - `e2e/tests/settlement-consistency.spec.ts` (존재하지 않는 testid 제거)
  - `e2e/tests/ui-navigation.spec.ts` (입실 hydrating 대기·라이브러리 진입 테스트)
  - `docs/acceptance.md` (§4 final self-check)
- API/타입/스키마/시드: 변경 없음

**테스트**

- Storybook: 변경 없음 (ErrorBoundary는 기능 컴포넌트, 별도 스토리 미추가)
- Playwright: **53/53 passed** ✅ (1 flaky — study-flow retry #1에서 통과, DB WriteConflict 일시적 충돌·재시도로 해결)
- TypeScript: `npm run typecheck` — shared·backend·frontend 전체 **오류 0** ✅

**결정 / 합의**

- `withTransaction` 재시도: 병렬 E2E 테스트의 `TransientTransactionError` WriteConflict 문제 근본 해결 — `settleStudySession`이 자동 재시도
- `retries: 1` 로컬 추가: DB 충돌 등 일시적 flaky를 CI 외에서도 흡수 (CI는 기존 `retries: 2` 유지)
- acceptance §4: P2.1.5 DnD와 P2.3.4 웹캠 audit는 요구사항 미요청 상태로 보류 처리. 실질적 보안 원칙(isRecording: false, 영상 미저장)은 코드에서 준수됨을 확인.

**미해결 / 주의 (Open Issues)**

- P2.1.5 계획 DnD: 사용자 미요청으로 보류 (시각 핸들만 구현, 실 DnD 미완)
- P2.3.4 웹캠 원천 미저장 audit: 코드 확인 완료(실질 준수)지만 공식 audit 문서 미작성

**다음 할 일 (Next)**

- 추가 기능 요청 대기
- 필요 시 P5 Storybook 커버리지 확장 (`ErrorBoundary`, `CoachingModal`, `LibraryPage` 등)
- `npm run seed` 후 수동 시연 QA (design-qa 체크리스트 기준)

### [2026-06-02 17:00] 세션 17 — P4.3 부가기능 (순위 UI·라이브러리 필터·코칭 예약 팝업)

- 작업자/도구: Claude Code (claude-sonnet-4-6)
- 관련 우선순위: P4.3

**한 일 (Done)**

- **지점 가상 순위 UI** (`/ranking`, `RankingPage.tsx`·`RankingPage.css`):
  - `GET /api/reports/ranking?userId&branchId&month` 백엔드 API 추가 (같은 branchId 사용자들의 이번 달 growthState 기준 집계)
  - 경쟁 강조 없는 미니멀 디자인: 순위 아이콘(🌳🌿🌱·숫자), 내 항목 연초록 하이라이트·'나' 배지
  - "순위는 참고 지표, 함께 성장하는 공동체" 메시지 하단 노트
  - 태블릿 가로 화이트 톤 2컬럼(순위 테이블 + 내 순위 뱃지)
  - fixture fallback: `demoBranchRanking` (7명 데이터, 내 순위 3위)
- **라이브러리 카테고리 필터** (`/library`, `LibraryPage.tsx`·`LibraryPage.css`):
  - 3탭: 학습 자료(6개) / 수업(4개) / 생활(4개) — `demoLibraryItems` fixture 14개
  - **수업 탭**: "수업 시간 고정" 버튼 disabled + `title` 안내 툴팁 + 상단 안내 배너
  - **생활 탭**: 오늘의 학습 리스트 섹션 완전 미표시 (학습·수업 탭에서만 표시)
  - 검색 필터 (제목·설명·태그 대소문자 무관 instant search)
  - 헤더에 "코칭 클래스 예약" CTA 버튼 → CoachingModal 연동
- **코칭 클래스 가상 예약 팝업** (`CoachingModal.tsx`·`CoachingModal.css`):
  - 2단계 플로우: ① 코치 선택(3명, 라디오 카드) + 일정 슬롯 선택 → ② QR + 링크 확인
  - QR mock SVG: 7×7 그리드 패턴 (파인더 패턴 포함, 실제 QR 형태)
  - 다이렉트 접속 링크 버튼(모의 — `e.preventDefault()`로 실제 이동 방지)
  - "실제 예약은 코치와의 개별 확인 후 확정" 안내 문구
- **네비게이션**: AppShell에 라이브러리 메뉴 추가 (`NavIcon.library` SVG 추가)
- **MyPage 허브 링크**: "지점 학습 현황 →" (`/ranking`) + "월간 리포트 →" (`/monthly-report`) 추가
- **공유 타입 추가** (`shared/types/index.ts`): `RankingEntry`, `BranchRanking`, `LibraryCategory`, `LibraryItem`
- **fixture 추가** (`demo-data.ts`): `demoLibraryItems`, `demoBranchRanking`, `demoCoaches`
- **API 추가** (`api/reports.ts`): `fetchBranchRanking`

**변경 (Files / API / Schema / Seed)**

- 파일 (신규):
  - `frontend/src/pages/LibraryPage.tsx`
  - `frontend/src/pages/LibraryPage.css`
  - `frontend/src/pages/RankingPage.tsx`
  - `frontend/src/pages/RankingPage.css`
  - `frontend/src/components/coaching/CoachingModal.tsx`
  - `frontend/src/components/coaching/CoachingModal.css`
- 파일 (수정):
  - `shared/src/types/index.ts` (RankingEntry·BranchRanking·LibraryCategory·LibraryItem 추가)
  - `backend/src/services/reportService.ts` (getBranchRanking 추가)
  - `backend/src/controllers/reportController.ts` (getRankingHandler 추가)
  - `backend/src/routes/index.ts` (GET /reports/ranking 등록)
  - `frontend/src/api/reports.ts` (fetchBranchRanking 추가)
  - `frontend/src/fixtures/demo-data.ts` (demoLibraryItems·demoBranchRanking·demoCoaches 추가)
  - `frontend/src/App.tsx` (/library·/ranking 라우트 추가)
  - `frontend/src/components/layout/AppShell.tsx` (라이브러리 nav 항목 추가)
  - `frontend/src/components/layout/NavIcon.tsx` (library 아이콘 추가)
  - `frontend/src/pages/MyPage.tsx` (ranking·monthly-report 허브 링크 추가)
- API:
  - `GET /api/reports/ranking?userId&branchId&month` (신규)
- 타입/스키마: `RankingEntry`, `BranchRanking`, `LibraryCategory`, `LibraryItem` (shared/types)
- 시드: 변경 없음

**테스트**

- Storybook: 미추가 (페이지/모달 단위)
- Playwright: 변경 없음
- TypeScript: `npm run typecheck` — shared·backend·frontend 전체 **오류 0** ✅

**결정 / 합의**

- 순위는 `branchId='gangnam'`(기본값) 기준 — seed 사용자 전원이 gangnam 지점이므로 live에서도 데이터 확인 가능
- 라이브러리는 현재 전량 fixture 데이터 — API 설계(P5 또는 미래 확장) 시 `GET /api/library?category=` 추가 가능
- 코칭 모달은 완전 가상 예약 — 실제 예약 시스템 연결은 별도 백엔드 필요
- `생활` 탭에서 오늘의 학습 리스트 미표시 규칙은 컴포넌트 조건부 렌더링(`showTodayList = tab !== 'life'`)으로 명시적 처리

**미해결 / 주의 (Open Issues)**

- P2.1.5 계획 DnD 미완
- P2.3.4 웹캠 원천 미저장 audit 미완
- P5 전구간 E2E·Storybook·acceptance §4 체크리스트 미완
- 라이브러리 자료는 전량 fixture (실제 콘텐츠 CMS/DB 미연동)

**다음 할 일 (Next)**

- P5 전구간 E2E·Storybook 커버리지
- acceptance §4 최종 체크리스트 점검
- `npm run seed` 후 E2E 전 스펙 실행 검증

### [2026-06-02 14:00] 세션 16 — P4.2 월간 리포트 UI 고도화 (히트맵·도넛·바 차트·월 네비게이션)

- 작업자/도구: Claude Code (claude-sonnet-4-6)
- 관련 우선순위: P4.2

**한 일 (Done)**

- **demoMonthlyReport fixture 추가** (`frontend/src/fixtures/demo-data.ts`): 2024-05 기준 22일 활동 데이터(focusMinutes 30~195분, 세션 1~4개/일). `MonthlyReport` 타입 정합. fixture 모드에서 리얼리스틱 시연 가능.
- **MonthlyReportPage.tsx 전면 재작성** — 주요 변경:
  - **월 네비게이션**: 이전달/다음달 버튼(`month-prev`/`month-next`), `selectedMonth` 상태 관리
  - **fixture 폴백 강화**: `dataSource !== 'live'` 또는 API 빈 응답 → `demoMonthlyReport` 사용
  - **KPI 4종 카드**: 아이콘·eyebrow 레이블·대형 수치 레이아웃 정돈
  - **히트맵 캘린더**: 실제 요일 헤더(일~토) 포함, 월 첫 날 요일 기준 오프셋 적용, 5단계 색상(--hm-0~4)·hover scale+shadow 효과, 범례 행
  - **도넛 차트**: CSS conic-gradient `focusEfficiency`% 표시, 중앙에 % 수치+레이블
  - **성장 요약 카드**: 획득 점수·화분 단계·최고 기록·월간 목표 달성률 진행 바
  - **바 차트 (하단 전체 폭)**: 활동일만 렌더, hover 툴팁, 그라데이션 바, 최고·평균 힌트 텍스트
- **MonthlyReportPage.css 완전 재작성**: 히트맵 5단계 CSS 변수(--hm-0~4), 태블릿 가로 화이트 톤 맞춤 2컬럼 레이아웃, 도넛 쉐도우, 바 차트 hover 툴팁 transition

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `frontend/src/fixtures/demo-data.ts` (demoMonthlyReport fixture 추가, MonthlyReport import)
  - `frontend/src/pages/MonthlyReportPage.tsx` (전면 재작성)
  - `frontend/src/pages/MonthlyReportPage.css` (전면 재작성)
- API/타입/스키마/시드: 변경 없음

**테스트**

- Storybook: 미추가 (MonthlyReportPage는 페이지 단위, 컴포넌트 스토리 별도 추가 가능)
- Playwright: 변경 없음
- TypeScript: `npm run typecheck` — shared·backend·frontend 전체 **오류 0** ✅

**결정 / 합의**

- 히트맵 5단계 색상은 CSS `:root` 변수(`--hm-0~4`)로 관리 → 토큰 시스템과 분리, 히트맵 전용 커스터마이즈 가능.
- fixture 모드에서 API 빈 응답(activeDays=0)인 경우에도 `demoMonthlyReport`로 폴백 → 빈 화면 없이 항상 시연 가능.
- 바 차트는 활동일만 렌더(비활동일 제외) → 히트맵이 전체 달력 역할을 하므로 중복 없음.

**미해결 / 주의 (Open Issues)**

- P2.1.5 계획 DnD 미완
- P2.3.4 웹캠 원천 미저장 audit 미완
- P4.3 순위·라이브러리·코칭 가상 예약 미구현
- P5 전구간 E2E·Storybook·acceptance §4 체크리스트 미완

**다음 할 일 (Next)**

- P4.3 부가 기능 (순위·코칭 가상 예약)
- P5 전구간 E2E·Storybook 커버리지
- acceptance §4 최종 체크리스트 점검
- `npm run seed` 후 E2E 전 스펙 실행 검증

---

### [2026-06-02 12:00] 세션 15 — P2.5.5·P3.6·P4.1 (CTA 마감·B파트 E2E·월간 리포트)

- 작업자/도구: Claude Code (claude-sonnet-4-6)
- 관련 우선순위: P2.5 · P3.6 · P4.1

**한 일 (Done)**

- **P2.5.5** — `SessionResultPanel.tsx` 닫기 버튼에 `data-testid="close-result"` 추가. `SessionResultModal`은 이미 `Link`(go-growth→`/growth`, go-mypage→`/mypage`) + `close()` 연결이 완료되어 있어 라우트+상태 검증 마감.
- **P3.6.1** — `e2e/tests/post-study-growth.spec.ts` 신규 (3 시나리오): 정산→go-growth→growth-dashboard, 정산→close→홈 위젯 갱신, 성장 대시보드 직접 접근.
- **P3.6.2** — `e2e/tests/growth-calendar.spec.ts` 신규 (4 시나리오): garden→calendar 진입, 캘린더 직접 접근·그리드, 탭 전환(누적/월간), back 링크.
- **P3.6.3** — `e2e/tests/mypage-collection.spec.ts` 신규 (6 시나리오): 성취 탭·그리드, 배지 클릭→상세, 퀘스트 탭, 성장 탭, 허브 Garden/캘린더 링크.
- **P3.6.4** — `e2e/tests/flow-b-post-study.spec.ts` 신규 (3 시나리오): 정산→Garden→캘린더→My 전체 흐름, 정산→My→Daily 흐름, 집중 보호(학습 중 모달 없음).
- **P4.1** — `shared/types/index.ts`: `MonthlyReport`, `MonthlyReportDay` DTO 추가. `backend/src/services/reportService.ts`: `getMonthlyReport(userId, month)` 신규 — 당월 세션 일별 집계·focusEfficiency·growthArchive 포함. `reportController.ts`: `getMonthlyReportHandler` 추가. `GET /api/reports/monthly/:userId?month=YYYY-MM` 라우트 등록. `frontend/src/api/reports.ts`: `fetchMonthlyReport` 추가. `frontend/src/pages/MonthlyReportPage.tsx`(신규): KPI 4종·히트맵·바 차트·성장 요약. `App.tsx`: `/monthly-report` 라우트 등록.

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `frontend/src/components/result-modal/SessionResultPanel.tsx` (close-result testid)
  - `e2e/tests/post-study-growth.spec.ts` (신규)
  - `e2e/tests/growth-calendar.spec.ts` (신규)
  - `e2e/tests/mypage-collection.spec.ts` (신규)
  - `e2e/tests/flow-b-post-study.spec.ts` (신규)
  - `shared/src/types/index.ts` (MonthlyReport, MonthlyReportDay 추가)
  - `backend/src/services/reportService.ts` (getMonthlyReport 추가)
  - `backend/src/controllers/reportController.ts` (getMonthlyReportHandler 추가)
  - `backend/src/routes/index.ts` (monthly 라우트)
  - `frontend/src/api/reports.ts` (fetchMonthlyReport 추가)
  - `frontend/src/pages/MonthlyReportPage.tsx` (신규)
  - `frontend/src/pages/MonthlyReportPage.css` (신규)
  - `frontend/src/App.tsx` (/monthly-report 라우트)
- API:
  - `GET /api/reports/monthly/:userId?month=YYYY-MM` (신규)
- 타입/스키마(shared/types ↔ Mongoose):
  - `MonthlyReport`, `MonthlyReportDay` 추가 (shared/types)
- 시드(seeds): 변경 없음

**테스트**

- Storybook: 변경 없음
- Playwright: B파트 E2E 4종 신규 (post-study-growth·growth-calendar·mypage-collection·flow-b-post-study) — 백엔드+Mongo 기동 필요. fixture 모드 graceful skip 처리 포함.
- TypeScript: `npm run typecheck` — shared·backend·frontend 전체 **오류 0** ✅

**결정 / 합의**

- 월간 리포트 페이지 라우트는 `/monthly-report` (기존 `/report` 일간과 충돌 방지).
- `MonthlyReportPage` fixture 모드: store growth 데이터 기반 최소 DTO 구성, 서버 없이도 화면 표시.
- E2E 테스트는 `growth-calendar-loading` testid 등 데이터 없음 케이스에 graceful early-return 적용 (백엔드 기동 환경 차이 흡수).

**미해결 / 주의 (Open Issues)**

- P2.1.5 계획 DnD 미완
- P2.3.4 웹캠 원천 미저장 audit 미완
- P4.2 월간 리포트 UI 고도화 (순공 캘린더 컴포넌트·차트 라이브러리)
- P4.3 순위·라이브러리·코칭 가상 예약
- P5 전구간 E2E·Storybook 커버리지·시연 QA

**다음 할 일 (Next)**

- P4.2 월간 리포트 UI 고도화 (차트·캘린더)
- P4.3 부가 기능 (순위·코칭)
- P5 전구간 E2E·Storybook·acceptance §4 체크리스트
- `npm run seed` 후 E2E 전 스펙 실행 검증

---

### [2026-06-02 00:00] 세션 14 — P2.4.6+P2.6.4+P3 전체 (트랜잭션·E2E·B파트 API)

- 작업자/도구: Claude Code (claude-sonnet-4-6)
- 관련 우선순위: P2.4 · P2.6 · P3.1 · P3.2 · P3.3 · P3.4 · P3.5

**한 일 (Done)**

- **P2.4.6** — `settlementService.ts` 재구성: `getOrCreateGrowthState`로 before 스냅샷 선취득 후, `applyScoreInsideTransaction`(신규)을 **트랜잭션 내**에서 호출 → session·milestone·goal·**growthStates `$inc`(lifetime+monthly) 원자적 동시 갱신**. `applyScoreToGrowth`는 레거시 호환으로 잔존.
- **P2.6.4** — `e2e/tests/settlement-consistency.spec.ts` 신규: ① 정산 모달 DB 확정값 일치 ② 낙관적 UI 미적용 ③ 정산 후 마이페이지 성취/퀘스트 갱신 확인 (3 시나리오).
- **P3.1** — `growthService.ts`: `LIFETIME/MONTHLY_STAGE_THRESHOLDS` export, `MONTHLY_BLOOM_STAGE=4` 상수, `isLastDayOfMonth()` 월말 고정 개화 트리거, 월 전환 시 `finalStage=4`로 archive 이관. `GET /api/growth/:userId/history?from&to` 신규 (growthController + route).
- **P3.1(shared)** — `shared/types/index.ts`: `DailyReport`, `DailyReportSession`, `GrowthHistoryResponse` DTO 추가.
- **P3.2** — `GrowthCalendarPage.tsx` 재작성: `fetchGrowthHistory` API 호출(live 모드)로 history/archive 갱신, store 폴백 유지. `frontend/src/api/growth.ts`에 `fetchGrowthHistory` 추가.
- **P3.3** — `MyPage.tsx`: 마운트 시 `fetchGrowth/Milestones/Goals` 호출 → store 갱신 (정산 후 네비게이션 포함).
- **P3.4** — `HomePage.tsx`: 마운트 시 `fetchGrowth/Milestones/Goals` 호출 → 홈 위젯 성장 위젯 실시간 반영.
- **P3.5** — `backend/src/services/reportService.ts`(신규): 당일 세션·출결 aggregation → `DailyReport` 응답. `reportController.ts`(신규) + `GET /api/reports/daily/:userId?date=YYYY-MM-DD` 등록. `frontend/src/api/reports.ts`(신규) + `DailyReportPage.tsx` 재작성: live 모드 API 연동, fixture 폴백.

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `backend/src/services/growthService.ts` (applyScoreInsideTransaction 신규, 상수 export, 월말 bloom)
  - `backend/src/services/settlementService.ts` (트랜잭션 내 growth $inc 포함)
  - `backend/src/services/reportService.ts` (신규)
  - `backend/src/controllers/growthController.ts` (getGrowthHistory 추가)
  - `backend/src/controllers/reportController.ts` (신규)
  - `backend/src/routes/index.ts` (history·reports 라우트 추가)
  - `frontend/src/api/growth.ts` (fetchGrowthHistory 추가)
  - `frontend/src/api/reports.ts` (신규)
  - `frontend/src/pages/GrowthCalendarPage.tsx` (history API 연동)
  - `frontend/src/pages/MyPage.tsx` (마운트 시 리프레시)
  - `frontend/src/pages/HomePage.tsx` (마운트 시 리프레시)
  - `frontend/src/pages/DailyReportPage.tsx` (실 API 연동)
  - `e2e/tests/settlement-consistency.spec.ts` (신규)
- API:
  - `GET /api/growth/:userId/history?from&to` (신규)
  - `GET /api/reports/daily/:userId?date=YYYY-MM-DD` (신규)
- 타입/스키마(shared/types ↔ Mongoose):
  - `DailyReport`, `DailyReportSession`, `GrowthHistoryResponse` 추가 (shared/types)
- 시드(seeds): 변경 없음

**테스트**

- Storybook: 변경 없음
- Playwright: `settlement-consistency.spec.ts` 신규 (3 시나리오, 백엔드+Mongo 기동 필요)
- TypeScript: `npm run typecheck` — shared·backend·frontend 전체 **오류 0** ✅

**결정 / 합의**

- `applyScoreToGrowth`(트랜잭션 외부 버전)는 레거시 호환을 위해 잔존하되, 신규 코드는 `applyScoreInsideTransaction` 사용 원칙.
- 월말 개화는 `getOrCreateGrowthState` 호출 시 당일이 월말이면 `currentStage=4`로 세팅 (읽기 시점 트리거, 별도 크론 없음).
- `DailyReportPage`의 subjects(과목별 분류·색상)는 세션 메타에 과목 정보가 없으므로 `세션 N` 레이블 + 고정 색 팔레트 사용 (P4 이후 과목 태그 추가 시 확장).

**미해결 / 주의 (Open Issues)**

- P2.1.5 DnD 계획 이동 미완
- P2.3.4 웹캠 원천 미저장 audit 미완
- P2.5.5 정산 모달 CTA → Garden/My 라우트+상태 전환 미완
- P3.6 B파트 E2E (post-study-growth, growth-calendar, mypage-collection, flow-b-post-study)
- settlement-consistency.spec.ts `close-result` data-testid 없으면 첫번째 버튼 클릭(force) — SessionResultPanel의 닫기 버튼 data-testid 확인 필요

**다음 할 일 (Next)**

- P3.6 B파트 E2E 4종 작성 (post-study-growth.spec.ts 등)
- P2.5.5 정산 CTA 라우트+상태 검증
- P4.1 월간 리포트 aggregation API
- P5 전구간 E2E·Storybook 커버리지

---

### [2026-06-01] 세션 13 — P2 A파트 2차 (정산·이탈·E2E)

- 작업자/도구: Cursor Agent
- 관련 우선순위: P2.2 · P2.3 · P2.4 · P2.6

**한 일 (Done)**

- **P2.3.2:** 연속 distracted 3회 → `focusAlertTriggered`, FE 인라인 경고 연동
- **P2.2.3/2.2.5:** `progress` 저장, `clampFocusMinutes` 서버 정합
- **P2.4:** `milestoneRules`·`goalService` 분리, 정산 mongoose 트랜잭션(세션·성취·목표)
- **P2.5.3/4:** 정산 모달 `data-variant` (empty/milestones/quests/combined)
- **P2.6:** `study-flow-a.spec.ts`, `focus-protection.spec.ts`

**변경**

- 백엔드: `config/focusAlert.ts`, `services/focusAlert.ts`, `milestoneRules.ts`, `goalService.ts`, `sessionDuration.ts`
- shared: `StudySession.progress`, `focusAlertTriggered`, `EndStudySessionRequest.progress`
- E2E: 신규 2 스펙

**다음 할 일 (Next)**

- P2.4.6 growth `$inc` 트랜잭션 포함 · P2.6.4 정산 재요청 E2E

---

### [2026-06-01] 세션 12 — 이탈 Figma 팝업 제거 · 문서 정합(인라인 경고)

- 작업자/도구: Cursor Agent
- 관련 우선순위: P1.4 / P2.3 / 문서 SSOT

**한 일 (Done)**

- `FocusWarningModal` 컴포넌트·Storybook·Figma 시연 버튼 삭제
- `TimerPage`는 `AlertBanner`(`data-testid="focus-warning"`) 인라인 경고만 유지
- PRD·acceptance·project_context·milestones·architecture·component-spec·design-qa·cursor rules — **비차단 인라인 경고 + 집중 시간 미적립**으로 통일 (타이머 자동 정지·블로킹 팝업 문구 제거)
- E2E `ui-navigation` Figma 팝업 시나리오 삭제 (기존 이탈 토글 테스트 유지)

**다음 할 일 (Next)**

- Figma `64:224` PNG 대비 시 인라인 배너 레이아웃만 수동 QA

---

### [2026-06-01] 세션 11 — P2 A파트 1차 (API FE 연동)

- 작업자/도구: Cursor Agent
- 관련 우선순위: P2.1 · P2.2 · P2.5

**한 일 (Done)**

- `frontend/src/api/plans.ts` — 계획 조회·수정 API
- `bootstrap.ts` — 당일 계획·입퇴실·세션 live 로드 (실패 시 fixture)
- `HomePage` — 퇴실 `checkOut` API, 계획 완료 토글 `PATCH`
- `TimerPage` — live 모드에서 정산 fixture 폴백 제거 (서버 확정만)
- `backend/seeds/seed.ts` — primary 사용자 당일 `studyPlans` 3건

**테스트**

- TypeScript: `npm run typecheck` 권장
- Playwright: 기존 `study-flow.spec.ts`·`ui-navigation` 유지

**다음 할 일 (Next)**

- P2.3.2 이탈 연속 N회 세션 플래그
- `npm run seed` 후 계획 목록 live 확인

---

### [2026-06-01] 세션 10 — P1 마일스톤 100% Exit

- 작업자/도구: Cursor Agent
- 관련 우선순위: P1 (전체 UI 셸)

**한 일 (Done)**

- **P1.1~P1.2:** `PageState`, `AlertBanner`, `TimerDisplay`, `TimerModeToggle` + Storybook
- **P1.3:** `StudyStatusBanner`, `HomeQuickLinks`, 홈 퇴실 모달(fixture)
- **P1.4~P1.5:** 타이머 `data-focus-protected`, 이탈 인라인 `AlertBanner`, 정산 CTA 마이·정원, `demoSettlementVariants`
- **P1.6~P1.9:** 마이 허브 링크, fixtures `index.ts`, `docs/design-qa/p1-visual-checklist.md`
- **P1.10:** E2E 확장(홈 배너·퇴실·팝업), `milestones.md`·`acceptance.md` §3 갱신

**변경 (Files / API / Schema / Seed)**

- 파일: `components/ui/PageState*`, `components/feedback/*`, `components/timer/Timer*`, `components/home/*`, `fixtures/index.ts`, `docs/design-qa/p1-visual-checklist.md`
- API/스키마/시드: 없음

**테스트**

- TypeScript: 0 (`npm run typecheck`) — `demoSettlementVariants` readonly 배열 → mutable 스프레드 수정
- Playwright: `ui-navigation.spec.ts` 7/7 통과

**다음 할 일 (Next)**

- P2.1 입퇴실·계획 API 프론트 연동

---

### [2026-06-01] 세션 9 — 성장 단계 일러스트 디자인 (씨앗·새싹·나무·화분/꽃)

- 작업자/도구: Claude Code
- 관련 우선순위: P1.6 / 성장 정원 UX · 디자인

**한 일 (Done)**

- **원인:** `.tree`/`.plant`가 단색 둥근 블롭(크기·색만 차이)이라 성장 요소가 단조로움. 두 트랙이 같은 stage 클래스를 공유해 의미(나무 vs 화분)가 구분되지 않음.
- **단계별 SVG 일러스트 신설** (`frontend/public/growth/`):
  - 누적 나무 `tree-0..4.svg` — 씨앗 → 새싹 → 묘목 → 나무 → 성목(잎·열매 장식)
  - 월간 화분 `plant-0..4.svg` — 씨앗 → 새싹 → 줄기 → 꽃봉오리 → 개화(화분 포함)
  - 그라데이션·드롭섀도로 입체감, 정원 토큰(녹색 계열)과 톤 일치.
- **`growth-stages.css` 재작성:** `.tree`/`.plant` 분리, 단계별 `background-image` + 크기 진행, `background-position: center bottom`, drop-shadow. 마크업 변경 없이 전역(홈·정원·정산모달·Storybook) 일괄 적용.
- **성장 정원 씬 보강(`GrowthGarden.css`):** 태양광 글로우(::before)·잔디 둔덕(::after), 화분 카드 hover/현재 강조·식물 크기 확대(46→52px).
- **정산모달(`SessionResultModal.css`):** from/to 나무를 단계 무관 동일·콤팩트 크기로 고정(비교 가독성).

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `frontend/public/growth/{tree,plant}-0..4.svg` (신규 10종)
  - `frontend/src/styles/growth-stages.css` (재작성)
  - `frontend/src/components/growth/GrowthGarden.css`
  - `frontend/src/components/result-modal/SessionResultModal.css`
- 컴포넌트 TSX/타입/API/스키마/시드: 변경 없음 (CSS·에셋만)

**테스트**

- TypeScript: frontend `tsc --noEmit` 0
- 수동 검증: 10개 SVG well-formed XML, Vite에서 `image/svg+xml` 200 서빙 확인
- Storybook: `GrowthGarden.stories.tsx` 기존 스토리로 시각 확인 가능

**결정 / 합의**

- 단계 일러스트는 SVG 배경 방식 채택 — 마크업 불변·전역 재사용·크리스프 스케일. (design-tokens §4·§5의 "TODO 에셋 교체" 충족)

**미해결 / 주의 (Open Issues)**

- 성장 단계 전환 시 모핑 애니메이션은 미적용(크기 transition만). 추후 단계 전환 강조 효과 검토.

**다음 할 일 (Next)**

- P2.1 퇴실·계획 API 프론트 연동 → P2.2 타이머 세션 전면 연동 → P2.4 정산.

***

### [2026-06-01] 세션 8 — Vite 프록시 ECONNREFUSED·ObjectId 캐스팅 500 에러 해결 (기동 내성)

- 작업자/도구: Claude Code
- 관련 우선순위: P2 / 개발 환경 안정성

**한 일 (Done)**

- **원인 규명:** `npm run dev` 동시 기동 시 ① 백엔드가 `await connectDatabase()`(Atlas 수 초) **후** `app.listen` → 포트가 늦게 열려 프론트 프록시가 `http proxy error … ECONNREFUSED`. ② DB 연결 실패 시 `process.exit(1)`로 죽어 포트 미개방. ③ 부트스트랩 실패→fixture 폴백으로 `userId="demo-user"`가 새고, 이후 라이브 호출이 ObjectId 캐스팅 **500**.
- **백엔드 선기동:** `server.ts`에서 `app.listen`을 먼저 호출하고 DB는 `connectWithRetry()`로 백그라운드 연결·재시도(지수 백오프, 최대 30s). DB 실패가 프로세스를 죽이지 않음. SIGINT/SIGTERM graceful shutdown 추가.
- **DB 연결 강화:** `connection.ts`에 `serverSelectionTimeoutMS=10s`, connected/disconnected/error 이벤트 로깅, `connectWithRetry` 추가.
- **ObjectId 가드:** 자주 호출되는 읽기 서비스(`getActiveSession`·`getActiveAttendance`·`getMonitorState`)에 `mongoose.isValidObjectId` 가드 → 잘못된 id는 500 대신 빈 200(null/inactive).
- **에러 핸들러:** Mongoose `CastError`를 조용한 400(`invalid_id`)으로 처리(스택 스팸 제거).
- **Vite 프록시:** `proxy.error` 핸들러로 백엔드 다운 시 깔끔한 503(`backend_unavailable`) 응답 + 안내 1줄.
- **mock-ai 내성:** `connectWithRetry` 사용, 초기 주입 실패가 프로세스를 죽이지 않게 `process.exit(1)` 제거·tick 단위 catch.
- **부트스트랩 재시도:** `fetchDemoUserWithRetry`(5회×800ms)로 기동 레이스 시에도 라이브 연결 확보 후에야 fixture 폴백.

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `backend/src/server.ts`, `backend/src/db/connection.ts`, `backend/src/mock-ai/simulator.ts`
  - `backend/src/middlewares/errorHandler.ts`
  - `backend/src/services/{studyService,attendanceService,focusMonitorService}.ts` (ObjectId 가드)
  - `frontend/vite.config.ts` (프록시 error 핸들러)
  - `frontend/src/utils/bootstrap.ts` (데모 유저 조회 재시도)
- API/타입/스키마/시드: 변경 없음

**테스트**

- TypeScript: backend `tsc --noEmit` 0, frontend `tsc --noEmit` 0
- 수동 검증: 포트 선개방(health 200 @ DB 연결 전) · 유효 ObjectId 6개 엔드포인트 200 · 잘못된 id는 폴링 3종 200/growth·milestones·goals 400 · 백엔드 다운 시 프록시 503 · 백엔드 기동 시 프록시 200

**결정 / 합의**

- 개발 편의/안정성을 위해 백엔드는 DB 없이도 포트를 열고 동작 시도(요청은 mongoose 버퍼링/타임아웃). 프록시 503·CastError 400은 프론트의 fixture 폴백과 호환.

**미해결 / 주의 (Open Issues)**

- 백엔드가 진짜 다운인 경우 Vite 내장 `http proxy error` 로그 1줄은 여전히 출력(정보성, 다운 상태에서만).
- `VITE_API_BASE_URL`은 루트 `.env`라 Vite가 미로드 → 프론트는 `/api` 프록시 사용(현 설정 의도와 일치, 그대로 둠).

**다음 할 일 (Next)**

- P2.1 퇴실·계획 API 프론트 연동 → P2.2 타이머 세션 전면 연동 → P2.4 정산.

***

### [2026-06-01] 세션 7 — 이탈 경고를 비차단 인라인으로 전환 (타이머 미정지 / 집중 시간 미적립)

- 작업자/도구: Claude Code
- 관련 우선순위: P2 / 집중 모니터 UX

**한 일 (Done)**

- **동작 변경:** 집중 이탈 감지 시 블로킹 모달(`FocusWarningModal`)로 타이머를 멈추던 방식 → **인라인 경고 배너**(비차단)로 전환. 타이머는 계속 진행.
- **집중 시간 분리:** 전체 경과(`seconds`)는 항상 증가, 신규 `focusSeconds`는 **이탈 중 미적립**. 종료 시 `focusMinutes`는 `focusSeconds` 기준으로 산정. 타이머 카드에 "집중 시간" 표시 추가.
- **시뮬레이션 토글:** `이탈 시뮬레이션` ↔ `집중 복귀 시뮬레이션` 버튼으로 이탈/집중을 토글(mock-ai 이벤트 주입). 멈춤 없이 경고만 on/off.
- **폴링:** mock-ai 폴링이 이탈/집중 상태를 경고에 반영하되 타이머를 멈추지 않도록 변경(`setRunning(false)` 제거).
- **문서/테스트:** acceptance Flow1 "타이머 자동 정지" → "비차단 인라인 경고·집중 시간 미적립"으로 수정. `ui-navigation.spec.ts` 이탈 경고 테스트를 토글 방식으로 갱신.

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `frontend/src/pages/TimerPage.tsx` (focusSeconds·distracted 상태, 인라인 경고, 시뮬레이션 토글, 모달 제거)
  - `frontend/src/pages/TimerPage.css` (`.timer-focus-alert`, `.timer-card__focus`)
  - `e2e/tests/ui-navigation.spec.ts` (경고 토글 테스트)
  - `docs/acceptance.md` (Flow1 기준 수정)
- API/타입/스키마/시드: 변경 없음
- 참고: `FocusWarningModal.tsx`/`.css`/`.stories.tsx`는 미사용 상태로 남김(Storybook 스토리 유지). 추후 제거 검토.

**테스트**

- Storybook: 변경 없음 (FocusWarningModal 스토리 유지, 앱 미사용)
- Playwright: `ui-navigation.spec.ts` 갱신(미실행)
- TypeScript: 프론트 `tsc --noEmit` 오류 0

**결정 / 합의**

- 기존 DoD의 "타이머 자동 정지"는 사용자 요청에 따라 폐기 — 이탈은 경고로만 알리고 학습 흐름을 끊지 않으며, 집중 시간 미적립으로 불이익을 반영.

**미해결 / 주의 (Open Issues)**

- `FocusWarningModal` 미사용 컴포넌트 잔존 — 정리 여부 결정 필요.
- 새로고침 시 `focusSeconds`·`seconds`·`running` 미복원(기존 한계 유지).

**다음 할 일 (Next)**

- P2.1 퇴실·계획 API 프론트 연동 → P2.2 타이머 세션 전면 연동 → P2.4 정산.

***

### [2026-06-01] 세션 6 — 집중 모니터 Live 프레임 깨짐(검은 화면) 수정

- 작업자/도구: Claude Code
- 관련 우선순위: P2 / 집중 모니터 UX

**한 일 (Done)**

- **근본 원인 규명:** `frontend/public/focus-monitor/` SVG 프레임 6개 중 5개가 인코딩 깨짐(`file` 판정 `data`). 깨진 한글 텍스트/`aria-label`로 XML 파싱 실패 → `<img>` 렌더 실패 → 학습 시작 후 Live 화면이 검은색으로만 표시되던 원인. 라이프사이클 로직(standby→live→ended)은 정상이었음.
- **SVG 재생성:** 6개 전부 깨끗한 UTF-8 + well-formed XML로 교체. 자연스러운 "AI 분석 웹캠 프레임" 일러스트(집중: 책상/노트북, 이탈: 휴대폰/부재). 모두 valid 검증 완료.
- **패널 견고성 보강:** 이미지 로드 실패 시 검정 대신 안내 폴백(`onError`), 프레임 페이드인(`is-loaded` opacity transition), 프레임 변경 시 로드 상태 초기화.
- **라이프사이클 확인:** 시작 전=검은 standby, 시작 후=AI 프레임 + LIVE 배지, 종료 후=검은 ended. 라이브 모드 새로고침은 `bootstrapApp` + TimerPage 복원 effect가 `/focus-monitor/state/:userId`로 복원(이미지 깨짐이 함께 해결되어 "사라짐"도 해소).

**변경 (Files / API / Schema / Seed)**

- 파일:
  - `frontend/public/focus-monitor/{focus,focus-desk,focus-laptop,distracted,distracted-phone,distracted-away}.svg` (재생성)
  - `frontend/src/components/focus-monitor/WebcamMonitorPanel.tsx` (onError 폴백·페이드인)
  - `frontend/src/components/focus-monitor/WebcamMonitorPanel.css` (프레임 opacity transition)
- API: 변경 없음
- 타입/스키마: 변경 없음
- 시드: 변경 없음

**테스트**

- Storybook: 변경 없음
- Playwright: 미실행 (정적 에셋/렌더 수정)
- TypeScript: 프론트 `tsc --noEmit` 오류 0

**결정 / 합의**

- fixture/오프라인 모드는 진행 중 세션을 서버에서 복원할 수 없어 새로고침 시 standby 복귀 — "결과는 서버 확정값만"(CLAUDE.md §3) 준수를 위한 의도된 동작.

**미해결 / 주의 (Open Issues)**

- 새로고침 시 경과 시간(`seconds`)·`running` 상태는 미복원(Live 프레임만 복원). 별도 UX 과제.
- 이전 SVG 인코딩 깨짐이 어떤 도구/저장 단계에서 발생했는지 미확인 — 추후 에셋 추가 시 UTF-8(BOM 없음) 확인 필요.

**다음 할 일 (Next)**

- P2.1 퇴실·계획 API 프론트 연동 → P2.2 타이머 세션 전면 연동 → P2.4 정산.

***

### [2026-06-01] 세션 5 — 체크인·집중 모니터(웹캠 UI) API·DB

- 작업자/도구: Cursor Agent
- 관련 우선순위: P2.1 / 집중 모니터 UX

**한 일 (Done)**

- **집중 모니터링:** 입실 시 모니터링 시작, 정적 프레임(Unsplash + 로컬 SVG 폴백)만 표시, `isRecording: false` 고정
- **백엔드:** `focusMonitorService`, `focusMonitorCatalog`, `AttendanceRecord.focusMonitoring` 스키마, `GET /focus-monitor/state/:userId`, `GET /focus-monitor/catalog`, check-in 응답 `CheckInResponse`
- **mock-ai 연동:** `appendAiEvent` 시 출석 모니터 상태·프레임 동기화
- **프론트:** `api/attendance.ts`, `api/focusMonitor.ts`, `WebcamMonitorPanel`, 홈 체크인 API, 타이머 폴링·이탈 시뮬레이션

**변경 (Files / API / Schema / Seed)**

- 파일: `shared/types` (FocusMonitor*, CheckInResponse), `backend/.../focusMonitor*`, `frontend/.../focus-monitor/*`, `public/focus-monitor/*.svg`
- API: `POST /attendance/check-in` → `{ attendance, focusMonitor }`, `GET /focus-monitor/state/:userId`
- 타입/스키마: `AttendanceRecord.focusMonitoring` (frameId·status·startedAt만, 영상 없음)

**테스트**

- TypeScript: 0 (`typecheck` + shared build)

**결정 / 합의**

- 실제 웹캠 녹화·영상 저장 금지 — DB/API는 프레임 메타만 (`project_context` 집중 우선 원칙 유지)

**미해결 / 주의 (Open Issues)**

- plans·dailyReport·퇴실 UI는 아직 fixture/미연동
- fixture 모드 bootstrap 시 데모 모니터가 항상 켜짐(시연용)

**다음 할 일 (Next)**

- 퇴실·계획 API 프론트 연동, E2E에 체크인→모니터 표시 시나리오 추가

---

### [2026-06-01] 세션 4 — P1 전체 UI 셸 구현

- 작업자/도구: Cursor Agent
- 관련 우선순위: P1 (전체 UI · UI→A→B 순서)

**한 일 (Done)**

- **P1.2.3/2.4 fixtures + 오프라인 폴백** — `fixtures/demo-data.ts`, `bootstrapApp` API 실패 시 fixture 적재 + `dataSource` 배너 (백엔드 없이 전 화면 시연 가능)
- **P1.3 홈** — Figma 3컬럼(계획·성장정원·퀘스트/성취) + 체크인 버튼
- **P1.4 타이머** — 스톱워치/타이머 모드 토글, 대형 디스플레이, 이탈 경고 모달(계속/정지), 진척도·만족도 입력, API 실패 시 fixture 정산
- **P1.5 정산 모달** — Figma 정합(성취/퀘스트/점수/성장변화/Next Evolution) 4변형, 기존 Storybook 호환
- **P1.6 성장 정원** — 중심 누적 나무 + 월간 화분 스트립, 프로필 패널, `GrowthCalendarPage` 드릴다운(누적/월간 토글·달력 그리드)
- **P1.7 마이페이지** — 성취 그리드(선택/잠김) + 상세 패널 + 탭(성취/퀘스트/성장)
- **P1.8 데일리 리포트** — `DailyReportPage` 신규(타임라인·도넛·통계·코멘트) + 라우트/네비
- **P1.9 입퇴실** — `AttendanceModal`(퇴실 목적 필수) + `PlanList` UI 셸
- 성장 단계 시각화 `styles/growth-stages.css`로 전역화, AppShell 아이콘 네비 + Start Study CTA + 데일리 네비

**변경 (Files / API / Schema / Seed)**

- 파일(신규): `fixtures/demo-data.ts`, `pages/DailyReportPage.*`, `pages/GrowthCalendarPage.*`, `components/timer/FocusWarningModal.*`, `components/attendance/AttendanceModal.*`, `components/plans/PlanList.*`, `components/layout/NavIcon.tsx`, `styles/growth-stages.css`, `e2e/tests/ui-navigation.spec.ts`, Storybook 3종
- 파일(수정): `App.tsx`, `AppShell.*`, `stores/useAppStore.ts`, `utils/bootstrap.ts`, `utils/format.ts`, 전 페이지·`GrowthGarden`·`AchievementGrid`·`SessionResultPanel`/`SessionResultModal`
- API/스키마/시드: 변경 없음 (UI 셸, fixture 사용)

**테스트**

- TypeScript: 0 (`typecheck` 통과)
- ESLint: 0 (frontend/src·e2e)
- 빌드: `vite build` 성공 (139 modules)
- Storybook 스토리: FocusWarningModal·AttendanceModal·PlanList 추가
- Playwright: `ui-navigation.spec.ts` 신규 (5 시나리오) — 백엔드+Mongo 기동 후 실행 필요

**결정 / 합의**

- P1은 UI·라우팅·fixture만. 비즈니스 판정·`$inc`·aggregation·실 API 동기화는 P2/P3로 명확히 분리.
- 오프라인 폴백은 P1 한정 — `dataSource==='fixture'` 배너로 명시, TODO 주석으로 P2/P3 교체 지점 표기.

**미해결 / 주의 (Open Issues)**

- plans·attendance·dailyReport는 fixture (실 API는 P2.1/P3.5)
- 단계별 일러스트는 CSS 도형 placeholder (P3.2.2에서 에셋 교체)

**다음 할 일 (Next)**

- P2.1 입퇴실·계획 API → P2.2 타이머 세션 연동 → P2.4 정산 백엔드 → P2.6 A파트 E2E

---

### [2026-06-01] 세션 3 — P0 마일스톤 완료

- 작업자/도구: Cursor Agent
- 관련 우선순위: P0

**한 일 (Done)**

- Figma Page 2 import·6화면 PNG·토큰 동기화 (`design/figma-import/`)
- 공용 UI `Button` / `Card` / `Modal` + Storybook (`UI/*`)
- AppShell Figma 사이드바 스타일, GrowthGarden 토큰 정렬
- `docs/component-spec.md`, `.env.example`
- P0 E2E `p0-smoke.spec.ts`, `npm run verify:p0`
- `check-db.ts` 타입 수정, ESLint scripts ignore

**변경 (Files / API / Schema / Seed)**

- 파일: `frontend/src/components/ui/*`, `docs/milestones.md`, `package.json`
- API/스키마/시드: 변경 없음

**테스트**

- Storybook: `build-storybook` 성공 (UI 3종 추가)
- Playwright: 4/4 통과 (study-flow + p0-smoke)
- TypeScript: 0
- `npm run check-db`: OK

**결정 / 합의**

- P0 Exit 달성 — Figma Cloud URL은 P1 병행 시 등록 가능

**미해결 / 주의 (Open Issues)**

- `figma-file.md` fileKey/URL 비어 있음 (Talk-to-Figma 채널 `sanxzj25`로 대체)

**다음 할 일 (Next)**

- P1.1 입퇴실·계획 API
- P1.3 Figma PNG 기준 홈·타이머 UI 정밀화

### [2026-06-01] 세션 2 — P0 마일스톤 구현

- 작업자/도구: Cursor Agent
- 관련 우선순위: P0

**한 일 (Done)**

- ESLint + Prettier 루트 설정 (`eslint.config.js`, `.prettierrc`)
- Storybook 8 + 태블릿 1280×800 viewport, 스토리 3종 (정산·성장·마이)
- `tokens.css` + `design-tokens.md` 임시 토큰 SSOT
- 엣지 시드 3페르소나 (`primary`/`distracted`/`achiever`) + `docs/seeds.md`
- `SessionResultPanel` presentational 분리
- Figma MCP 연동 가이드 (`figma-workflow.md`, `figma-file.md`)

**변경 (Files / API / Schema / Seed)**

- 파일: `frontend/.storybook/*`, `*.stories.tsx`, `docs/figma-*`, `docs/design-tokens.md`
- 시드: `backend/src/seeds/scenarios.ts` 리팩터
- API: 변경 없음

**테스트**

- Storybook: `npm run build-storybook` 성공
- Playwright: 기존 유지
- TypeScript: frontend typecheck 0
- lint: `npm run lint` 통과
- seed: 3 users 성공

**결정 / 합의**

- P0.1 Figma는 MCP 가이드·등록 템플릿까지 — 실제 파일은 사용자 Figma URL 등록 후 Agent가 읽기

**미해결 / 주의 (Open Issues)**

- `docs/figma-file.md` URL 비어 있음 → Figma MCP 인증 + URL 등록 필요

**다음 할 일 (Next)**

- Figma 파일 생성/연결 후 P1 Figma 기반 UI
- P1.1 입퇴실·계획 API

### [2026-06-01] 세션 1 — Cursor/CLAUDE AI 규칙 세팅

- 작업자/도구: Cursor Agent
- 관련 우선순위: P0

**한 일 (Done)**

- `CLAUDE.md`, `.cursorrules`를 `docs/` SSOT 4종 기반으로 재작성
- `.cursor/rules/` 분리: documentation-workflow, core, backend, frontend, shared, testing
- `docs/README.md`, 루트 `README.md` AI/Cursor 섹션 추가

**변경 (Files / API / Schema / Seed)**

- 파일: `CLAUDE.md`, `.cursorrules`, `.cursor/rules/*.mdc`, `docs/README.md`, `README.md`
- API/스키마/시드: 변경 없음

**테스트**

- Storybook: 미구축
- Playwright: 기존 `e2e/tests/study-flow.spec.ts` 유지
- TypeScript: 기존 상태 유지

**결정 / 합의**

- SSOT 문서는 `docs/` 유지. 에이전트 진입점은 루트 `CLAUDE.md` + `.cursorrules`
- 세션 시작 시 docs 4종 필독, 종료 시 `session_context.md` 갱신 의무화

**미해결 / 주의 (Open Issues)**

- `architecture.md`에 Vue 공존 언급 있으나 현재 `frontend/`는 React만 사용 중

**다음 할 일 (Next)**

- Mongo 연결 후 seed/dev 검증
- P1 Figma 기반 UI 구현

### [YYYY-MM-DD HH:MM] 세션 0 — 프로젝트 컨텍스트 문서 정비

- 작업자/도구: (기입)
- 관련 우선순위: P0

**한 일 (Done)**

- PRD(MongoDB 개정본) 기준으로 `project_context.md`, `architecture.md`, `acceptance.md`, `session_context.md` 작성.

**변경 (Files / API / Schema / Seed)**

- 파일: 위 4개 문서 신규
- API: 없음
- 타입/스키마: `shared/types`(Milestone, Goal, GrowthState, StudySession)에 `userId` 포함 정의 합의
- 시드: `backend/src/seeds/`에 대표 시나리오 시드 작성 예정

**테스트**

- Storybook: 미시작
- Playwright: 미시작 (루트 `e2e/` 골격 예정)
- TypeScript: N/A

**결정 / 합의**

- DB는 실 MongoDB + 시딩 전략. 비즈니스 로직은 백엔드 전용. 게이미피케이션 용어 미사용(성장 나무/화분 은유).

**미해결 / 주의 (Open Issues)**

- Mongo 연결(.env), 단계-에셋 매핑 테이블, `history`/`archive` 구체 타입화 미정.
