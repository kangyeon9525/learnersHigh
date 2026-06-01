# Figma 파일 등록 (팀 공유)

> **비밀 토큰은 적지 마세요.**

| 항목 | 값 |
|------|-----|
| **파일 URL** | _(Figma Cloud에 Publish 후 URL 등록)_ |
| **fileKey** | _(URL에서 추출)_ |
| **로컬 연동 채널** | `sanxzj25` (Talk-to-Figma MCP · WebSocket 3055) |
| **기준 페이지** | `Page 2` — 태블릿 와이어 6종 |
| **뷰포트** | 1280×1024 (Frame) |
| **담당** | |
| **최종 동기화** | 2026-06-01 |

## Page 2 — 화면 ↔ 코드 매핑

| Figma Frame | nodeId | 코드 페이지/컴포넌트 | 참조 PNG |
|-------------|--------|---------------------|----------|
| Home Dashboard (Personalized) | `64:495` | `frontend/src/pages/HomePage.tsx` | `design/figma-import/screens/home-dashboard.png` |
| Study Timer with Focus Warning | `64:224` | `frontend/src/pages/TimerPage.tsx` | `design/figma-import/screens/study-timer-focus-warning.png` |
| Session Result Modal Overlay | `64:384` | `frontend/src/components/result-modal/` | `design/figma-import/screens/session-result-modal.png` |
| Growth Garden Dashboard | `64:3` | `frontend/src/pages/GrowthDashboardPage.tsx` | `design/figma-import/screens/growth-garden-dashboard.png` |
| My Page — Achievement & Growth Collection | `64:637` | `frontend/src/pages/MyPage.tsx` | `design/figma-import/screens/mypage-achievements.png` |
| Daily Report | `64:856` | _(P4 미구현)_ | `design/figma-import/screens/daily-report.png` |

## 재동기화 (Talk-to-Figma)

1. Figma Desktop → **Cursor Talk to Figma MCP** 플러그인 → 채널 `sanxzj25` · localhost **3055**
2. 터미널: `bun x cursor-talk-to-figma-socket` (또는 `npm run figma:socket`)
3. `npm run figma:import` — JSON + PNG 갱신

메타·스크립트: `design/figma-import/README.md`

## 페이지 구조 (P0.1 목표)

- `00-Tokens` — Color / Spacing / Radius Variables _(Page 2 색상 → `tokens.css` 반영됨)_
- `01-Wireframes` — **Page 2에 6 Frame으로 존재**
- `02-Components` — Button, Card, Modal, Timer …
- `03-Growth-Assets` — 나무·화분 단계별
- `04-Result-Modal` — Empty / Milestone / Quest / Combined

연동 방법: [figma-workflow.md](./figma-workflow.md)
