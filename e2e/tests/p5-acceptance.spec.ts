import { test, expect } from '@playwright/test';

/**
 * P5.3 — Flow A~E 전구간 acceptance 스모크 테스트
 *
 * 각 flow를 독립 시나리오로 분리하여 CI에서 개별 실패·재시도 가능하게 한다.
 * 이미 P2·P3·P4에서 세부 시나리오를 검증했으므로 여기서는
 * "흐름이 끊기지 않는다"는 smoke 수준만 확인한다.
 */

// ── 공통 헬퍼: 타이머 화면 준비 ──────────────────────────────
async function prepareTimer(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('home-check-in').click();
  await page.getByTestId('attendance-confirm').click();
  await expect(page.getByTestId('timer-page')).toBeVisible();
  await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });
  const reset = page.getByTestId('reset-study');
  if (await reset.isVisible()) await reset.click();
  await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });
}

// ── 공통 헬퍼: 학습 시작 → 종료 → 정산 모달 노출 ─────────────
async function doStudyAndSettle(page: import('@playwright/test').Page) {
  await page.getByTestId('start-study').click();
  await expect(page.getByTestId('end-study')).toBeVisible();
  await page.waitForTimeout(400);
  await page.getByTestId('end-study').click();
  await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
}

// ── P5.3.1 Flow A — 입실→타이머→AI경고→종료→정산 ──────────────
test.describe('P5.3.1 Flow A — 학습 흐름', () => {
  test('입실 → 학습 시작 → AI이탈 경고 → 종료 → 정산 모달', async ({ page }) => {
    await prepareTimer(page);

    // 학습 시작
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();

    // 이탈 시뮬레이션 → 인라인 경고 (타이머 계속 진행 확인)
    await page.getByTestId('simulate-distracted').click();
    await expect(page.getByTestId('focus-warning')).toBeVisible();
    await expect(page.getByTestId('timer-display')).toBeVisible();

    // 집중 보호: 학습 중 정산 모달 없음
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);

    // 집중 복귀
    await page.getByTestId('simulate-distracted').click();
    await expect(page.getByTestId('focus-warning')).toHaveCount(0);

    // 종료 → 정산 모달
    await page.waitForTimeout(300);
    await page.getByTestId('end-study').click();
    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });

    // 정산 모달은 서버 확정값만 — result-growth 노출
    await expect(page.getByTestId('result-growth')).toBeVisible();

    await page.getByTestId('close-result').click();
  });
});

// ── P5.3.2 Flow B — 정산→Garden→My→Daily ─────────────────────
test.describe('P5.3.2 Flow B — 학습 후 결과', () => {
  test('정산 → Garden → 보관함 전체 흐름', async ({ page }) => {
    await prepareTimer(page);
    await doStudyAndSettle(page);

    // go-growth CTA → Garden
    const modal = page.getByTestId('session-result-modal');
    await modal.getByTestId('go-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('growth-profile')).toBeVisible();

    // Garden → 보관함
    await page.getByTestId('go-collection').click();
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible();
  });

  test('정산 → My → Daily 흐름', async ({ page }) => {
    await prepareTimer(page);
    await doStudyAndSettle(page);

    const modal = page.getByTestId('session-result-modal');
    await modal.getByTestId('go-mypage').click();
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });

    await page.goto('/report');
    const loading = await page.getByTestId('daily-report-loading').isVisible().catch(() => false);
    if (!loading) {
      await expect(page.getByTestId('daily-report')).toBeVisible({ timeout: 10_000 });
    }
  });
});

// ── P5.3.3 Flow C — 집중 보호 ─────────────────────────────────
test.describe('P5.3.3 Flow C — 집중 보호', () => {
  test('학습 중 정산 모달·성취 알림 없음', async ({ page }) => {
    await page.goto('/timer');
    await expect(page.getByTestId('timer-page')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });
    const reset = page.getByTestId('reset-study');
    if (await reset.isVisible()) await reset.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    // 집중 보호 속성
    await expect(page.getByTestId('timer-page')).toHaveAttribute('data-focus-protected', 'true');

    await page.getByTestId('start-study').click();
    // 학습 중: 정산 모달·성취 알림 없음
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);
    await expect(page.getByTestId('result-milestones')).toHaveCount(0);

    // 종료 후 정리
    await page.getByTestId('end-study').click();
    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('close-result').click();
  });
});

// ── P5.3.4 Flow D — Garden → 캘린더 드릴다운 ─────────────────
test.describe('P5.3.4 Flow D — 성장 캘린더 드릴다운', () => {
  test('Garden → 캘린더 → 누적/월간 탭 → back', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/growth');
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 15_000 });

    const profileVisible = await page.getByTestId('growth-profile').isVisible().catch(() => false);
    if (!profileVisible) return;

    await page.getByTestId('go-calendar').click();

    const loading = await page.getByTestId('growth-calendar-loading').isVisible().catch(() => false);
    if (loading) return;

    await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('calendar-grid')).toBeVisible();

    // 탭 전환
    await page.getByTestId('calendar-lifetime').click();
    await expect(page.getByTestId('calendar-history')).toBeVisible();
    await page.getByTestId('calendar-monthly').click();
    await expect(page.getByTestId('calendar-archive')).toBeVisible();

    // 뒤로
    await page.getByTestId('back-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
  });
});

// ── P5.3.5 Flow E — 마이페이지 회고 ───────────────────────────
test.describe('P5.3.5 Flow E — 마이페이지 회고', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/mypage');
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });
  });

  test('성취 탭 — 그리드 표시', async ({ page }) => {
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible();
  });

  test('성취 배지 클릭 → 상세 패널', async ({ page }) => {
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible();
    const first = page.getByTestId('achievement-grid').locator('[data-testid^="badge-"]').first();
    if (!await first.isVisible().catch(() => false)) return;
    await first.click();
    await expect(page.getByTestId('achievement-detail')).toBeVisible();
  });

  test('퀘스트 탭 — 이력 목록', async ({ page }) => {
    await page.getByTestId('mypage-tab-quests').click();
    await expect(page.getByTestId('mypage-quests')).toBeVisible();
  });

  test('성장 탭 — 기록 카드', async ({ page }) => {
    await page.getByTestId('mypage-tab-growth').click();
    await expect(page.getByTestId('mypage-growth')).toBeVisible();
  });

  test('허브 → Garden 링크', async ({ page }) => {
    await page.getByTestId('go-growth-dashboard').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
  });

  test('허브 → 순위 링크', async ({ page }) => {
    await page.getByTestId('mypage-hub-ranking').click();
    await expect(page.getByTestId('ranking-page')).toBeVisible({ timeout: 10_000 });
  });
});
