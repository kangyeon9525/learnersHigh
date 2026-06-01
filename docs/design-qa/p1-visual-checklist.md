# P1 시각 QA 체크리스트 (Figma PNG 대비)

> **목적:** P1.x.5 항목 — `design/figma-import/screens/` PNG와 구현 화면을 수동 대비한다.  
> **범위:** UI 셸만. 픽셀 퍼펙트 미달 시 이슈를 기록하고 P5 전에 보정한다.

## 공통

- [ ] 태블릿 가로 1280×1024 — AppShell·여백·터치 타겟
- [ ] 디자인 토큰(`tokens.css`) — 신규 UI 하드코딩 색상 없음
- [ ] Storybook `UI/*`, `Timer/*`, `Feedback/*`, `ResultModal/*` 주요 변형 확인

## 화면별

| 화면 | PNG | 페이지/컴포넌트 | 체크 |
|------|-----|-----------------|------|
| 홈 | `home-dashboard.png` | `HomePage` | [ ] 3컬럼·상태 배너·퀵링크·계획 빈 상태 |
| 타이머 | `study-timer-focus-warning.png` | `TimerPage` + `AlertBanner` | [ ] 모드 토글·이탈 인라인 경고·집중 시간 표시 |
| 정산 | `session-result-modal.png` | `SessionResultPanel` Storybook 4종 | [ ] Empty/Milestone/Quest/Combined |
| 성장 | `growth-garden-dashboard.png` | `GrowthDashboardPage` | [ ] 나무·화분 SVG·캘린더 링크 |
| 마이 | `mypage-achievements.png` | `MyPage` | [ ] 그리드·탭·상세·허브 링크 |
| 데일리 | `daily-report.png` | `DailyReportPage` | [ ] 타임라인·도넛·통계·코멘트 |

## E2E 스모크 (자동)

- `e2e/tests/ui-navigation.spec.ts` — 6화면 라우트·탭·타이머·캘린더

## 서명

- 검수자: ___________
- 일자: ___________
