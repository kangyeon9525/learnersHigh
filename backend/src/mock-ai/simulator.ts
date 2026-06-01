/**
 * 시딩된 집중/이탈 시나리오를 주기적으로 API에 주입 (웹캠 대체)
 */
import { config } from '../config.js';
import { connectWithRetry } from '../db/connection.js';
import { StudySessionModel } from '../db/models/index.js';

const SCENARIO: Array<'focus' | 'distracted'> = [
  'focus',
  'focus',
  'distracted',
  'focus',
  'distracted',
];

let index = 0;

async function injectOnce(apiBase: string) {
  const active = await StudySessionModel.findOne({ completed: false }).sort({ createdAt: -1 });
  if (!active) {
    console.log('[mock-ai] No active session — skip');
    return;
  }

  const status = SCENARIO[index % SCENARIO.length];
  index += 1;

  const res = await fetch(`${apiBase}/api/mock-ai/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: active._id.toString(), status }),
  });

  if (!res.ok) {
    console.warn('[mock-ai] Inject failed', await res.text());
    return;
  }

  console.log(`[mock-ai] Injected ${status} → session ${active._id.toString()}`);
}

async function main() {
  if (!config.mockAiEnabled) {
    console.log('[mock-ai] Disabled (MOCK_AI_ENABLED=false)');
    return;
  }

  // DB·API가 준비되기 전에 떠도 죽지 않고 재시도한다 (npm run dev 동시 기동 레이스 대응).
  void connectWithRetry();
  const apiBase = `http://127.0.0.1:${config.port}`;

  console.log(`[mock-ai] Running every ${config.mockAiIntervalMs}ms → ${apiBase}`);

  const tick = () => {
    injectOnce(apiBase).catch((err) => {
      console.warn('[mock-ai] tick 건너뜀 —', err instanceof Error ? err.message : err);
    });
  };

  setInterval(tick, config.mockAiIntervalMs);
}

main().catch((err) => {
  console.error('[mock-ai] Failed', err);
});
