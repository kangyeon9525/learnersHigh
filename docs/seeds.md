# seeds.md — 시드 데이터 시나리오

> `npm run seed` 실행 시 MongoDB에 적재되는 대표·엣지 페르소나.

---

## 페르소나

| key | displayName | 용도 |
|-----|-------------|------|
| `primary` | 김러너 | **기본 데모** (`GET /api/users/demo`) — 미달성 성취, 진행 중 퀘스트 |
| `distracted` | 박이탈 | 집중 이탈 `aiEvents` 다수 — mock-ai·타이머 경고 E2E |
| `achiever` | 최성실 | 달성 성취·고득점 growth — 정산 모달 복합·성장 UI |

시드 실행 후 콘솔에 출력되는 `userId`를 E2E/API 테스트에 사용.

---

## 컬렉션별 요약

### primary (김러너)

- Growth: lifetime 80pt, monthly 40pt, archive 2개월
- Milestones: 3개 미달성
- Goals: daily/weekly/monthly 진행 중
- Session: 완료 25분, 혼합 aiEvents

### distracted (박이탈)

- Growth: 저점수 초기
- Milestone: 첫 학습만 달성
- Session: 8분, distracted 위주 aiEvents

### achiever (최성실)

- Growth: lifetime stage 3, history 2건
- Milestones: 2개 달성
- Goals: daily 완료
- Session: 55분 고만족

---

## 재현

```bash
npm run check-db
npm run seed
```

코드: `backend/src/seeds/scenarios.ts`, `backend/src/seeds/seed.ts`

---

## E2E 권장

1. `npm run seed` 후 Playwright 실행
2. `primary` userId로 기본 학습 루프
3. `distracted` — AI 경고 시나리오 (향후 user switch API 또는 env)
