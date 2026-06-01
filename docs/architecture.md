# architecture.md — 러너스하이(Learners High) 아키텍처 & 개발 규칙

> **목적:** 구조와 규칙을 고정한다. 코드를 작성/수정하기 전 본 문서 규칙을 우선 적용하며, 충돌 시 본 문서가 개별 선호보다 우선한다.
> **사용 대상:** Cursor Rules / Claude Code 및 개발자 (Figma MCP 바이브코딩)
> **연관:** `project_context.md`, `acceptance.md`

---

## 1. 기술 스택

### 1.1 공통

- **언어:** TypeScript (strict, `any` 최소화) — 프론트/백 전 영역.
- **아키텍처:** Monorepo 워크스페이스: `frontend`, `backend`, `shared`, 루트 `e2e`.
- **도메인 타입(SSOT):** `shared/types`에 단일 정의. 프론트/백/Mongoose 스키마는 모두 이 타입과 일치시킨다. 학습 종료 정산 응답 DTO `StudySessionResult`도 여기서 정의하되, 저장 컬렉션이 아닌 **응답 전용 타입**임을 주석으로 명시한다.

### 1.2 프론트엔드

- **프레임워크:** React, Vue 공존(앱/모듈 단위). **한 앱/모듈은 한 프레임워크만** 사용.
- **상태관리:** Zustand(React)/Pinia(Vue). 전역에는 **서버 응답 결과만** 저장, 파생값은 selector/computed.
- **HTTP:** `src/api/` 계층(axios/fetch)으로만 호출. 컴포넌트 직접 fetch 금지.
- **타겟:** 태블릿 가로 모드 우선.
- **구현 워크플로우:** Figma 디자인을 기준 소스로 한 바이브코딩(Figma MCP + Cursor). 임의 디자인 변형 금지.

### 1.3 백엔드

- **런타임:** Node.js + Express 또는 Fastify.
- **계층:** `routes → controllers → services → db(Mongoose 모델)` 단방향. 역방향 import 금지.
- **DB:** MongoDB + Mongoose ODM. 컬렉션 `users`, `studySessions`, `milestones`, `goals`, `growthStates`.
- **연결:** 연결 문자열은 `.env`로 분리(커밋 금지). 로컬/Docker/Atlas 전환 가능하게 구성.

---

## 2. 디렉토리 구조

bash

`runners-high/ (Project Root)
├── frontend/                   # 학생 태블릿 앱 (React/Vue)
│   └── src/
│       ├── components/         # UI 컴포넌트
│       │   ├── result-modal/   # 학습 종료 정산 모달(성취/퀘스트 달성 일괄 안내)
│       │   ├── growth/         # 성장 통합 대시보드 위젯(중심 누적 나무 + 주변 월간 화분)
│       │   └── mypage/         # 마이페이지 성취·성장 보관함 위젯
│       ├── pages/              # 화면 단위 라우팅 컴포넌트(타이머, 성장 대시보드, 마이페이지 등)
│       ├── api/                # 백엔드 호출 유틸 (유일한 통신 진입점)
│       ├── stores/             # 전역 상태 (Zustand/Pinia)
│       └── utils/              # 공통 헬퍼
├── backend/                    # Node.js API 서버
│   └── src/
│       ├── server.ts           # 엔트리(포트 바인딩)
│       ├── app.ts              # 앱 설정/미들웨어 초기화
│       ├── routes/             # 엔드포인트 (/api/study, /api/goals 등)
│       ├── controllers/        # 요청 검증 + 응답 반환
│       ├── services/           # 핵심 로직(성취/목표 판정, 성장 단계 계산, 종료 정산 집계)
│       ├── middlewares/        # 에러 핸들링/로깅
│       ├── db/                 # Mongo 연결 + Mongoose 모델/스키마
│       ├── seeds/              # 웹캠·사용자 목 데이터 시딩 (seed.ts 등)
│       └── mock-ai/            # 시딩된 집중/이탈 데이터를 주기 주입하는 시뮬레이터
├── shared/
│   └── types/                  # Milestone, Goal, GrowthState, StudySessionResult 등 공통 DTO (SSOT)
├── e2e/                        # Playwright E2E
│   ├── playwright.config.ts    # baseURL, 프로젝트/브라우저 설정
│   └── tests/                  # 시나리오 스펙(학습 루프, 종료 정산 모달, 성장 대시보드, 마이페이지, 리포트)
├── package.json                # 루트 워크스페이스
└── .cursorrules                # 바이브코딩 컨텍스트 규칙`

**구조 규칙**

- 새 도메인 타입은 `shared/types`에 먼저 정의 → 프론트/백 import → Mongoose 스키마 일치. (응답 전용 DTO인 `StudySessionResult`는 스키마 매핑 없이 응답 조립에만 사용.)
- 새 API는 `routes` 등록 → 대응 `controllers`/`services` 추가. 엔드포인트 컨벤션 `/api/{도메인}`(`/api/study`, `/api/goals`, `/api/milestones`, `/api/growth`).
- 학습 종료 처리(`POST /api/study/session`)는 세션 저장 + 성취/목표 판정 + 성장 반영을 수행하고, **종료 정산 결과(`StudySessionResult`)를 응답에 포함**한다.
- 프론트 통신은 `src/api/`를 거친다(raw fetch 금지).
- DB 접근은 `db/`(Mongoose 모델)로 일원화. `services`는 모델을 통해서만 접근.
- 워크스페이스 경계를 넘는 의존은 `shared`만 허용. `frontend`↔`backend` 직접 import 금지.

---

## 3. 개발 규칙

### 3.1 공통

- TypeScript strict, 컴파일 경고/오류 0. 임시 `any[]`(`history`/`archive`)는 TODO + 백로그.
- 매직 넘버 금지: 성취 조건·목표값·성장 단계 임계치는 상수/설정으로 외부화.
- 시간은 서버 기준 ISO String 통일(`startedAt`, `endedAt`, `at`). 문서 ID는 `_id`(ObjectId)를 문자열 `id`로 직렬화.
- 문서 간 관계는 `userId` 등 ObjectId 문자열 참조.

### 3.2 프론트엔드 규칙

- 컴포넌트는 **표시만** 책임. 점수 계산·판정·성장 단계 산정 금지(백엔드 위임).
- 흐름: API 호출 → 응답 수신 → 스토어 갱신 → 리렌더.
- **집중 보호:** 학습 진행 중에는 성취/목표 달성 알림·모달을 노출하지 않는다. 달성 안내는 **학습 종료 후 정산 모달(`result-modal`)** 로만 일괄 노출한다.
- **낙관적 UI:** 액션 즉시 임시 반영 → 응답으로 reconcile. 불일치 시 **서버값 우선**(롤백/병합). 단, 종료 정산 모달은 낙관적 미적용(서버 확정 결과만 표시).
- 로딩/에러/빈 상태 UI를 항상 정의.

### 3.3 백엔드 규칙

- 책임 분리: `controllers`=요청 검증/응답, `services`=순수 비즈니스 로직, `db`=Mongoose I/O.
- **요청 검증:** `shared/types` DTO 기준 body/params 검증 후 통과.
- **판정 로직(services):** 학습 로그 수신 → 누적 학습시간·집중도 계산 → 성취/목표 판정 → 점수 산정 → 성장 단계(누적 나무·월간 화분) 동시 반영.
- **종료 정산(services):** 학습 종료 시 위 판정·반영 결과를 **일괄 집계**하여, 이번 세션의 신규 성취·완료 퀘스트·획득 점수·성장 단계 변동(`from/to`)을 담은 `StudySessionResult`를 구성해 응답에 포함한다. 학습 진행 중에는 판정 결과를 푸시/스트림하지 않는다.
- **영속화(db):** 누적 점수 증가 등은 **원자적 연산(`$inc`, `findOneAndUpdate`)** 사용. 다중 문서 동시 갱신은 트랜잭션. 부분 갱신/경합 방지. 정산 응답은 **저장이 끝난 DB 상태(산정값)** 를 근거로 조립한다.
- **시딩(seeds):** 대표 시나리오(사용자/세션/AI 이벤트/성취/목표/성장) 시드 스크립트 제공. 시드는 가공 더미만 사용.
- **mock-ai:** 시딩된 집중/이탈 데이터를 주기 재생·주입(실 웹캠 대체).
- **응답:** **실제 DB 상태에 근거**해 결과 + 갱신 유저 상태 + 종료 정산 결과를 함께 반환. 성공/검증오류 상태 코드는 실제 결과에 맞게.
- **에러 핸들링:** `middlewares` 공통 처리, 일관된 에러 응답 포맷.

---

## 4. 코딩 컨벤션

### 4.1 네이밍

- **변수/함수:** camelCase (`focusMinutes`, `calcGrowthStage`).
- **타입/인터페이스/클래스/컴포넌트:** PascalCase (`GrowthState`, `MilestoneCard`, `StudySessionResult`).
- **상수/환경값:** UPPER_SNAKE_CASE (`MAX_FOCUS_MINUTES`, `MONGO_URI`).
- **파일/폴더:** kebab-case (`growth-tree.tsx`, `study-session.service.ts`, `result-modal.tsx`).
  - React 컴포넌트 파일은 컴포넌트명과 일치하는 PascalCase도 허용(팀 내 택1 후 고정). 본 프로젝트 기본은 kebab-case.
- **불리언:** `is`/`has`/`should` 접두 (`isAchieved`, `hasArchive`).
- **이벤트 핸들러:** `handle` 접두 (`handleSubmit`), prop은 `on` 접두 (`onSubmit`).
- **백엔드 파일 접미:** 역할 명시 (`.controller.ts`, `.service.ts`, `.model.ts`, `.route.ts`, `.seed.ts`).
- **Mongoose 모델:** PascalCase 단수(`User`, `StudySession`), 컬렉션은 복수 소문자(`users`, `studySessions`).
- **약어 지양:** 의미가 드러나는 전체 단어 사용(`temp`→`temporary` 등). 통용 약어(`id`, `url`, `db`)는 허용.

### 4.2 파일/모듈 구성

- 한 파일 한 책임. 컴포넌트/서비스 파일이 비대(예: 300줄 초과)해지면 분할.
- **import 순서:** ① 외부 라이브러리 → ② `shared/*` → ③ 내부 절대경로(별칭) → ④ 상대경로. 그룹 사이 빈 줄.
- 경로 별칭(`@shared/*`, `@/*`) 사용 권장, 깊은 상대경로(`../../../`) 지양.
- 배럴 파일(`index.ts`)은 공개 API를 명확히 할 때만 사용(순환참조 주의).
- 공개 함수/타입은 named export 기본. default export는 React 컴포넌트 등 관례 영역에서만.

### 4.3 타입 / 에러 / 비동기

- `any` 금지(불가피하면 `unknown` + 좁히기). 임시 `any`는 `// TODO(types):` 주석과 백로그.
- 도메인 타입은 항상 `shared/types`에서 import(중복 선언 금지).
- 비동기는 `async/await`. 떠다니는 Promise 금지(반드시 await 또는 명시적 처리).
- 에러는 throw로 전파하고 경계(백엔드 `middlewares`, 프론트 error boundary/try-catch)에서 처리. 빈 catch 금지.
- 외부 입력(요청 body, 시드 데이터)은 신뢰하지 말고 검증 후 사용.

### 4.4 주석 / TODO

- "무엇"이 아니라 "왜"를 주석으로 남긴다(코드로 드러나는 내용 중복 금지).
- 임시/보류는 표준 태그: `// TODO:` `// FIXME:` `// HACK:` (+ 가능하면 이슈 번호). 임시 코드는 `session_context.md`에도 기록.

### 4.5 포맷팅 / 린트 (도구)

- **Prettier + ESLint** 적용, 저장 시 자동 포맷. 규칙은 루트 단일 설정으로 워크스페이스 공유.
- 권장 베이스: `@typescript-eslint`, import 순서 룰, React/Vue 플러그인. 경고도 0 지향.
- 커밋/푸시 전 `lint`·`type-check`·`test` 통과를 전제. (도입 시 husky + lint-staged로 pre-commit 훅 권장.)

### 4.6 환경 변수

- 모든 비밀/환경값은 `.env`(커밋 금지) + `.env.example`(키만, 값은 placeholder) 동시 관리.
- 키는 UPPER_SNAKE_CASE, 접두로 스코프 표기(`MONGO_URI`, `BACKEND_PORT`, `VITE_API_BASE_URL` 등).
- 코드에서 직접 `process.env` 산재 금지: `config` 모듈에서 1회 로드·검증 후 주입.

---

## 5. Git 컨벤션

### 5.1 브랜치 전략

- 기본 브랜치: `main`(항상 배포/시연 가능 상태). 통합 브랜치 사용 시 `develop`.
- 작업 브랜치 네이밍: `<type>/<범위>-<요약>` (kebab-case)
  - 예: `feat/backend-milestone-judgement`, `fix/frontend-timer-autostop`, `chore/e2e-playwright-setup`.
- 1 브랜치 = 1 목적. 장기 브랜치는 수시로 `main` rebase/merge로 최신화.

### 5.2 커밋 메시지 (Conventional Commits)

- 형식: `type(scope): subject`
  - **type:** `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `build`, `ci`, `chore`, `revert`.
  - **scope(권장):** 워크스페이스/모듈 — `frontend`, `backend`, `shared`, `e2e`, `db`, `seeds`, `mock-ai`, `ui`, `study`, `milestone`, `goal`, `growth`, `result-modal`, `mypage`, `report`.
  - **subject:** 명령형·현재형, 한국어 또는 영어 일관 사용, 마침표 없음, 50자 내 권장.
- 본문(선택): 무엇이 아니라 **왜** 바꿨는지. 이슈 참조 `Refs #12`, 종료 `Closes #12`.
- 호환성 깨짐: 제목에 `!` 또는 본문 `BREAKING CHANGE:` 명시.
- 예:
  - `feat(result-modal): 학습 종료 정산 모달 일괄 노출 추가`
  - `feat(growth): 성장 통합 대시보드 중심 나무+주변 화분 레이아웃 추가`
  - `fix(growth): 월간 화분 월말 고정 누락 수정`
  - `chore(db): mongoose 연결 .env 분리`
- 커밋은 작고 빌드 가능한 단위로. WIP/임시 커밋은 푸시 전 정리(squash).

### 5.3 PR / 코드 리뷰

- PR 제목도 Conventional Commits 형식 권장. 본문 템플릿:
  - **변경 요약 / 관련 PRD·우선순위(P0~P5) / 테스트(Storybook·Playwright·type-check 결과) / 체크리스트(`acceptance.md` 해당 항목) / 스크린샷 또는 Storybook 링크.**
- 머지 조건(게이트): `type-check` + `lint` + 관련 `Playwright` 통과, 리뷰 승인 1인 이상.
- 큰 PR 지양(리뷰 가능 단위로 분할). 자기 PR self-merge는 합의된 경우만.

### 5.4 머지 / 버전

- 머지 전략: 기능 브랜치는 **squash merge**로 히스토리 단순화(택1 후 고정).
- 머지 후 작업 브랜치 삭제.
- 버전 태그(필요 시): SemVer `vMAJOR.MINOR.PATCH`. 문서 버전과 분리 관리.

### 5.5 .gitignore (필수 항목)

- `node_modules/`, 빌드 산출물(`dist/`, `build/`), 로그.
- `.env` 및 모든 비밀 파일(`.env.local` 등) — **절대 커밋 금지**. `.env.example`만 커밋.
- 로컬 Mongo 데이터/덤프, 시드 산출 임시 파일.
- 에디터/OS 부산물(`.DS_Store`, `.idea/`, `.vscode/` 중 공유 불필요한 것).
- Playwright 산출물(`playwright-report/`, `test-results/`).

---

## 6. UI / 디자인 시스템 규칙

- **레이아웃:** 태블릿 가로 모드 기준. 고정 브레이크포인트 설계, 세로 모드 우선순위 낮음.
- **기준 소스:** Figma 디자인이 단일 기준. 색상/타이포/간격/라운드/그림자는 **디자인 토큰**으로만 사용(하드코딩 금지).
- **컴포넌트 우선순위:** 디자인 시스템에 존재하는 공용 컴포넌트를 **먼저 사용**. 없을 때만 신규 작성 후 시스템 편입.
- **성장 시각화:** 성장 나무/월간 화분은 `currentStage`에 따라 단계별 일러스트 전환(나무: 씨앗→새싹→묘목→성목 / 화분: 씨앗→개화). 단계-에셋 매핑 테이블 단일 정의.
- **성장 통합 대시보드(Growth Garden):** 캘린더 단독이 아닌 **한 화면 전체 그림(정원/풍경)** 으로 구성한다. 중심에 누적 성장 나무(메인 오브젝트)를 두고 주변에 월간 성장 화분(위성 오브젝트)을 배치하며, 누적/월간 캘린더 뷰는 대시보드에서 **드릴다운**으로 진입한다.
- **마이페이지 보관함:** 획득 성취 그리드(달성/미달성), 완료 퀘스트 이력, 성장 변화를 모아 표시하고 성장 대시보드·상세 캘린더로 진입하는 허브로 구성한다.
- **피드백:** 성취·목표 달성은 **학습 종료 후 정산 모달(`result-modal`)로 일괄 안내**한다. 학습 진행 중에는 집중/이탈 경고 외 동기 부여 알림을 노출하지 않는다. 성장 단계 상승은 위젯 애니메이션으로 표현하되 과도한 경쟁/보상 강조는 지양한다.

---

## 7. 테스트 규칙

### 7.1 Storybook (공용 컴포넌트)

- 공용 컴포넌트는 **반드시 Storybook 스토리** 작성. 스토리 없는 공용 컴포넌트는 미완료로 간주.
- 상태별 스토리 필수: default/loading/error/empty + 주요 변형(성장 단계별, 성취 잠김·달성, 정산 모달 결과 유형(성취만/퀘스트만/복합/획득 없음) 등).
- 태블릿 가로 뷰포트 프리셋에서 확인 가능.

### 7.2 Playwright (핵심 흐름 E2E · 루트 `e2e/`)

- **시딩된 DB 상태**를 전제로 핵심 플로우를 검증한다.
  - 입실 → 타이머 시작 → 학습 종료 → 성취/목표 일괄 판정 → **종료 정산 모달 노출** → 성장 반영 → 데일리 리포트 확인
  - 학습 진행 중에는 성취/목표 달성 알림이 노출되지 않음을 검증
  - 시딩된 AI 비정상 상태 재생 → 인라인 경고 노출 → 집중 시간 미적립(타이머는 계속)
  - 성장 탭 진입 → **통합 대시보드(중심 나무 + 주변 화분) 표시** → 누적/월간 캘린더 드릴다운에서 날짜별 성장 단계/달성 내역 조회
  - 마이페이지 보관함 진입 → 획득 성취·완료 퀘스트·성장 변화 조회
- API가 실제 MongoDB 상태에 근거해 응답하는지, 재요청 시 일관성이 유지되는지 검증.
- 테스트는 시드 → 실행 → 정리(또는 격리 DB) 순으로 재현 가능해야 한다.

---

## 8. 보안 / 개인정보 유의사항

- **최소 수집:** 학습 로그 외 불필요한 개인정보(이름·연락처 등)는 저장하지 않는다.
- **마스킹:** 화면/로그에 식별정보 노출이 불가피하면 마스킹(예: `홍*동`).
- **미저장 원칙:** 웹캠 원천 영상/프레임은 저장하지 않는다. 저장 대상은 집중/이탈 **상태 이벤트(`aiEvents`)** 와 시각만.
- **시드 데이터:** 가공 더미만 사용, 실제 개인정보·민감값 금지.
- **연결정보:** Mongo 연결 문자열·시크릿은 `.env`로 분리하고 커밋 금지. DB 자격증명/포트 노출 주의.
- **로그:** 콘솔/파일 로그에 식별정보·원천 감지 데이터 미기록. 디버그는 ID/요약 수준.
- **권한 경계:** 학생 데이터는 `userId` 범위로 한정. 관리자/코치용 데이터는 모의 경계 내에서만.

---

## 9. 규칙 우선순위

1. `project_context.md` (범위·제약) — 무엇을/왜
2. `architecture.md` (본 문서) — 어떻게(구조·규칙·컨벤션)
3. `acceptance.md` — 완료 인정 기준
   충돌 시 상위 문서가 우선하며, 변경은 합의 후 문서에 반영한다.
