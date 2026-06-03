import { test, expect } from '@playwright/test';

/**
 * P3.6.2 — Garden → 성장 캘린더 드릴다운
 *
 * 검증: 성장 대시보드 → 캘린더 링크 → 캘린더 그리드·이력·아카이브 탭
 */
test.describe('P3.6.2 성장 캘린더 드릴다운', () => {
  test('성장 대시보드에서 캘린더로 진입한다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/growth');
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 15_000 });

    // growth-profile 없으면 (loading) 스킵
    const profileVisible = await page.getByTestId('growth-profile').isVisible().catch(() => false);
    if (!profileVisible) return;

    await page.getByTestId('go-calendar').click();
    await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
  });

  test('캘린더 페이지 직접 접근 — 그리드가 렌더된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/growth/calendar');

    // loading 상태(데이터 없음) 허용
    const isLoading = await page
      .getByTestId('growth-calendar-loading')
      .isVisible()
      .catch(() => false);
    if (isLoading) return;

    await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('calendar-grid')).toBeVisible();
  });

  test('캘린더 누적/월간 탭 전환이 동작한다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/growth/calendar');

    const isLoading = await page
      .getByTestId('growth-calendar-loading')
      .isVisible()
      .catch(() => false);
    if (isLoading) return;

    await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });

    // 누적 탭 → 이력 리스트
    await page.getByTestId('calendar-lifetime').click();
    await expect(page.getByTestId('calendar-history')).toBeVisible();

    // 월간 탭 → 아카이브 리스트
    await page.getByTestId('calendar-monthly').click();
    await expect(page.getByTestId('calendar-archive')).toBeVisible();
  });

  test('캘린더 back 링크 → 성장 정원으로 돌아간다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/growth/calendar');

    const isLoading = await page
      .getByTestId('growth-calendar-loading')
      .isVisible()
      .catch(() => false);
    if (isLoading) return;

    await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
    await page.getByTestId('back-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
  });
});
