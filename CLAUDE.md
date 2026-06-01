# CLAUDE.md — Learners High AI Agent Guide

> **Cursor / Claude Code / 기타 코딩 에이전트**가 이 저장소에서 작업할 때의 **필수 진입 문서**입니다.  
> 상세 규칙·DoD·아키텍처는 `docs/` SSOT 문서를 따릅니다.

---

## 0. 세션 워크플로우 (필수)

### 작업 시작 전 — 반드시 읽기 (순서 고정)

1. [`docs/session_context.md`](./docs/session_context.md) — 최신 세션 로그, 다음 할 일, 미해결 이슈
2. [`docs/project_context.md`](./docs/project_context.md) — 범위·제약·비목표 (무엇을/하지 않을 것)
3. [`docs/architecture.md`](./docs/architecture.md) — 구조·계층·컨벤션 (어떻게)
4. [`docs/acceptance.md`](./docs/acceptance.md) — 완료 기준 (언제 끝냈는지)

**문서 우선순위 (충돌 시):** `project_context` > `architecture` > `acceptance` > `session_context`

### 작업 중

- 범위·아키텍처·DoD와 어긋나는 구현 금지. 불확실하면 문서를 다시 확인.
- 임시 코드(`TODO`/`FIXME`/`HACK`)는 `session_context.md`에 기록.
- 비즈니스 로직(점수·판정·성장·종료 정산)은 **백엔드 `services/`만**. 프론트는 표시.
- 도메인 타입은 **`shared/src/types`** SSOT. FE/BE/Mongoose 일치.

### 작업 종료 전 — 반드시 수행

1. [`docs/acceptance.md`](./docs/acceptance.md) 해당 항목 self-check
2. TypeScript 오류 0, 관련 Playwright/Storybook(해당 시) 확인
3. [`docs/session_context.md`](./docs/session_context.md) **최상단에 새 세션 로그 추가** (템플릿 사용)

---

## 1. 프로젝트 한 줄 요약

**러너스하이(Learners High)** — 태블릿 학습 매니지먼트 프로토타입. 실 MongoDB + 시딩/Mock AI.  
**집중 우선:** 학습 중 성취·퀘스트 알림 금지 → **학습 종료 후 `StudySessionResult` 정산 모달**만.

---

## 2. 모노레포

| 워크스페이스 | 경로 | 역할 |
|-------------|------|------|
| frontend | `frontend/` | React + Vite 태블릿 앱 |
| backend | `backend/` | Express API, Mongoose, seeds, mock-ai |
| shared | `shared/` | `@learners-high/shared` 공통 DTO |
| e2e | `e2e/` | Playwright E2E |

**금지:** `frontend`↔`backend` 직접 import. 공유는 `shared`만.

---

## 3. 절대 규칙 (Non-Negotiable)

| # | 규칙 |
|---|------|
| 1 | 학습 진행 중 성취/목표/성장 **보상 UI·알림 금지**. 집중/이탈 경고만 허용. |
| 2 | 종료 정산 모달은 **서버 확정 `StudySessionResult`만** 표시 (낙관적 UI 미적용). |
| 3 | 점수·판정·성장 단계·정산 집계 → **`backend/src/services/`** |
| 4 | API는 **실제 DB 상태** 기준 응답. `$inc`/`findOneAndUpdate`/트랜잭션으로 무결성. |
| 5 | FE HTTP는 **`frontend/src/api/`** 만. 컴ponent 직접 fetch 금지. |
| 6 | 웹캠 원천 미저장. `aiEvents`(상태·시각)만. `.env`·시크릿 커밋 금지. |
| 7 | 게이미피케이션 용어 배제. 성장 나무/화분은 학습 성장 **은유**로만. |

---

## 4. 백엔드 계층

```
routes → controllers (zod 검증) → services (비즈니스) → db (Mongoose)
```

- 종료 API: 세션 저장 + 성취/목표 판정 + 성장 반영 → **`StudySessionResult` 응답 포함**
- Mock AI: `backend/src/mock-ai/` — 시딩 집중/이탈 주기 주입

---

## 5. 프론트엔드

- Zustand: **서버 응답 결과**만 전역 저장
- `data-testid`로 E2E 셀렉터 제공
- Figma + 디자인 토큰 기준. 태블릿 **가로** 우선
- 공용 컴포넌트 → Storybook (default/loading/error/empty)

---

## 6. 로컬 실행

```bash
# .env에 MONGODB_URI 설정 (Atlas 또는 로컬)
npm install
npm run build -w @learners-high/shared
npm run seed
npm run dev            # API + FE + mock-ai
```

---

## 7. Cursor 설정

| 파일 | 역할 |
|------|------|
| [`.cursorrules`](./.cursorrules) | Cursor 전역 규칙 (본 문서와 동기화) |
| [`.cursor/rules/`](./.cursor/rules/) | alwaysApply / glob별 세부 규칙 |
| [`docs/`](./docs/README.md) | SSOT 프로젝트 문서 |

---

## 8. 응답 언어

- 사용자 대화: **한국어**
- 코드 식별자·커밋: Conventional Commits (`architecture.md` §5.2)

---

## 9. 상세 문서 링크

- [project_context.md](./docs/project_context.md) — 배경·범위·리스크·시딩 전략
- [architecture.md](./docs/architecture.md) — 디렉터리·컨벤션·Git·테스트·보안
- [acceptance.md](./docs/acceptance.md) — Definition of Done
- [milestones.md](./docs/milestones.md) — 개발 마일스톤 P0~P5
- [session_context.md](./docs/session_context.md) — 세션 로그 (매 작업 후 갱신)
