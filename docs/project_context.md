# Project Context

> 프로젝트 개요, PRD 요약, 제약사항, 기술 스택을 기록하는 문서입니다.

## 서비스 개요

- **서비스명:** 러너스하이 (Learners High)
- **정의:** 학습 전 과정을 통합 관리하는 학습 매니지먼트 플랫폼
- **목적:** AI 기반 학습 상태 감지·자동 리포트로 자기주도학습 습관 형성

## 동기 부여 설계 원칙

- 학습 중: 성취·목표 알림 **노출 금지** (집중 우선)
- 학습 종료: 백엔드 일괄 정산 → `StudySessionResult` → 종료 정산 모달
- 누적 기록: 마이페이지 보관함에서 회고

## 기술 스택

| 영역 | 스택 |
|------|------|
| 구조 | npm workspaces 모노레포 |
| 언어 | TypeScript |
| FE | React + Vite |
| BE | Node.js + Express + Mongoose |
| DB | MongoDB (로컬 또는 Atlas) |
| E2E | Playwright |
| 디자인 | Figma → 바이브코딩 |

## 프로토타입 제약 (Mock / 시딩)

| 구분 | 구현 방식 |
|------|-----------|
| AI 감지 | `mock-ai` 시뮬레이터 + 시딩 데이터 재생 |
| DB | 실제 MongoDB CRUD |
| 외부 연동 | 목 데이터 시딩 후 API 실응답 |

## 관련 문서

- [architecture.md](./architecture.md) — 아키텍처·데이터 흐름
- [acceptance.md](./acceptance.md) — 수용 기준
- [session_context.md](./session_context.md) — 현재 작업 컨텍스트
- [README.md](./README.md) — 문서 목록
