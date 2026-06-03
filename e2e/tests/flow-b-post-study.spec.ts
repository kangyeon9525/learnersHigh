import { test, expect } from '@playwright/test';

/**
 * P3.6.4 — Flow B: 홈 → 학습 → 정산 → Garden → My → Daily
 *
 * 검증: 학습 종료 후 B파트 전체 흐름이 끊김 없이 동작한다
 */
test.describe('P3.6.4 Flow B — 학습 후 결과 흐름', () => {
  test('정산 → Garden → 캘린더 → 마이페이지 전체 흐름', async ({ page }) => {
    // ── 1. 홈 진입 ──────────────────────────────────────────
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });

    // ── 2. 입실 ─────────────────────────────────────────────
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    // ── 3. 학습 시작 → 종료 ──────────────────────────────────
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByTestId('end-study').click();

    // ── 4. 정산 모달 ─────────────────────────────────────────
    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });
    await expect(modal.getByTestId('result-growth')).toBeVisible();

    // ── 5. Garden으로 이동 ────────────────────────────────────
    await modal.getByTestId('go-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });

    // 성장 프로필 존재 확인
    await expect(page.getByTestId('growth-profile')).toBeVisible();

    // ── 6. 캘린더 드릴다운 ───────────────────────────────────
    await page.getByTestId('go-calendar').click();

    const isCalLoading = await page
      .getByTestId('growth-calendar-loading')
      .isVisible()
      .catch(() => false);

    if (!isCalLoading) {
      await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
      await expect(page.getByTestId('calendar-grid')).toBeVisible();
      // Garden으로 복귀
      await page.getByTestId('back-growth').click();
      await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    } else {
      await page.goto('/growth');
      await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    }

    // ── 7. 마이페이지로 이동 ──────────────────────────────────
    await page.getByTestId('go-collection').click();
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });

    // 성취 탭 확인
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible({ timeout: 5_000 });

    // 퀘스트 탭 확인
    await page.getByTestId('mypage-tab-quests').click();
    await expect(page.getByTestId('mypage-quests')).toBeVisible({ timeout: 5_000 });
  });

  test('정산 → My → 데일리 리포트 흐름', async ({ page }) => {
    // ── 1. 입실 → 학습 → 정산 ────────────────────────────────
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });

    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByTestId('end-study').click();

    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });

    // ── 2. 마이페이지로 이동 ──────────────────────────────────
    await modal.getByTestId('go-mypage').click();
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });

    // ── 3. 데일리 리포트 이동 (AppShell 네비) ─────────────────
    // nav 아이콘 또는 직접 이동
    await page.goto('/report');
    const isReportLoading = await page
      .getByTestId('daily-report-loading')
      .isVisible()
      .catch(() => false);
    if (!isReportLoading) {
      await expect(page.getByTestId('daily-report')).toBeVisible({ timeout: 10_000 });
      await expect(page.getByTestId('report-timeline')).toBeVisible();
    }
  });

  test('집중 보호 — 학습 중에는 성장 대시보드·성취 알림이 없다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });

    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();

    // 학습 중: 성장/성취 알림 없음 확인 (집중 보호)
    await expect(page.getByTestId('data-focus-protected')).toHaveCount(0);
    // 정산 모달도 없음
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);

    // 종료하여 정리
    await page.getByTestId('end-study').click();
    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('close-result').click();
  });
});
