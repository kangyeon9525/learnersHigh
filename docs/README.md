# AI Agent Context (`docs/`)

이 폴더는 프로젝트 **SSOT(Single Source of Truth)** 문서입니다.

## 에이전트 진입점

| 우선 | 파일 | 역할 |
|------|------|------|
| ★ | [../CLAUDE.md](../CLAUDE.md) | Cursor/Claude **필수** 진입 가이드 |
| ★ | [../.cursorrules](../.cursorrules) | Cursor 전역 규칙 |
| ★ | [../.cursor/rules/](../.cursor/rules/) | alwaysApply + glob별 세부 규칙 |

## SSOT 문서 (작업 전·후 필독)

| 순서 | 문서 | 언제 |
|------|------|------|
| 1 | [session_context.md](./session_context.md) | 세션 시작 — 최신 로그·다음 할 일 |
| 2 | [project_context.md](./project_context.md) | 범위·제약 확인 |
| 3 | [architecture.md](./architecture.md) | 구현 전 구조·컨벤션 |
| 4 | [acceptance.md](./acceptance.md) | 완료 전 DoD self-check |

**충돌 시 우선순위:** project_context > architecture > acceptance > session_context

## 문서 목록

| 문서 | 설명 |
|------|------|
| [project_context.md](./project_context.md) | 배경·범위·리스크·시딩 전략 |
| [architecture.md](./architecture.md) | 디렉터리·계층·Git·테스트·보안 |
| [acceptance.md](./acceptance.md) | Definition of Done |
| [milestones.md](./milestones.md) | **개발 마일스톤 (P0~P5) 로드맵** |
| [figma-workflow.md](./figma-workflow.md) | Figma MCP 연동 가이드 |
| [design-tokens.md](./design-tokens.md) | 디자인 토큰·성장 에셋 매핑 |
| [component-spec.md](./component-spec.md) | 공용 UI 컴포넌트 스펙 (P0.1.3) |
| [figma-file.md](./figma-file.md) | Figma 파일·채널·화면 매핑 |
| [seeds.md](./seeds.md) | 시드 시나리오 문서 |
| [session_context.md](./session_context.md) | 세션 로그 (작업 후 갱신) |

루트 [README.md](../README.md) — 저장소 개요·로컬 실행
