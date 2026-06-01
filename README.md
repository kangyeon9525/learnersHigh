# 러너스하이 (Learners High)

학습 매니지먼트 플랫폼 — 성취·목표·성장 기반 자기주도학습 프로토타입 (PRD 기반 모노레포)

## 구조

```
learnersHigh/
├── docs/              # 프로젝트 문서 (→ docs/README.md)
├── frontend/          # React + Vite (태블릿 학생 앱)
├── backend/           # Node.js + Express + Mongoose
├── shared/            # @learners-high/shared 공통 DTO
├── e2e/               # Playwright E2E
├── CLAUDE.md          # AI 에이전트 필수 가이드
├── .cursorrules       # Cursor 전역 규칙
├── .cursor/rules/     # Cursor glob·alwaysApply 규칙
└── README.md
```

## 빠른 시작

```bash
# 1. .env 파일에 MONGODB_URI 등 환경 변수 설정 (루트 .env — git 미추적)

# 2. 의존성 설치
npm install

# 4. 공통 타입 빌드 + 시드
npm run build -w @learners-high/shared
npm run seed

# 5. 개발 서버 (API + FE + Mock AI)
npm run dev
```

- 프론트: http://127.0.0.1:5173  
- API: http://127.0.0.1:4000/api/health  

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | backend + frontend + mock-ai 동시 실행 |
| `npm run seed` | MongoDB 목 데이터 시딩 |
| `npm run build` | shared → backend → frontend 빌드 |
| `npm run test:e2e` | Playwright E2E (서버 자동 기동) |

## 핵심 원칙

- **집중 우선:** 학습 중 성취·퀘스트 알림 없음 → 종료 시 `StudySessionResult` 정산 모달만 노출
- **서버 권위:** 판정·점수·성장은 `backend/src/services/`
- **Mock AI:** `backend/src/mock-ai/` — 웹캠 대체 집중/이탈 주입

## 문서

상세 문서는 [`docs/`](./docs/README.md) 폴더에 있습니다.

| 문서 | 설명 |
|------|------|
| [project_context.md](./docs/project_context.md) | PRD·제약·스택 |
| [architecture.md](./docs/architecture.md) | 아키텍처·API·데이터 흐름 |
| [acceptance.md](./docs/acceptance.md) | 수용 기준·E2E |
| [milestones.md](./docs/milestones.md) | 개발 마일스톤 (P0~P5) |
| [session_context.md](./docs/session_context.md) | 현재 작업 세션 |

## AI / Cursor 설정

에이전트(Cursor 등)는 **작업 전** `docs/` SSOT 4종을 순서대로 읽고, **작업 후** `session_context.md`에 로그를 남깁니다.

| 파일 | 역할 |
|------|------|
| [CLAUDE.md](./CLAUDE.md) | 에이전트 진입·워크플로우 |
| [.cursorrules](./.cursorrules) | Cursor 전역 규칙 |
| [.cursor/rules/](./.cursor/rules/) | 문서 워크플로우·계층별 세부 규칙 |

## 원격 저장소

https://github.com/kangyeon9525/learnersHigh
