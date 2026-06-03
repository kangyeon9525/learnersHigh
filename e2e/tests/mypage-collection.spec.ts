import { test, expect } from '@playwright/test';

/**
 * P3.6.3 — 마이페이지 보관함 (성취 그리드·퀘스트 이력·성장 기록·허브 네비)
 *
 * 검증: 탭 전환·성취 그리드·퀘스트 목록·Garden/캘린더 허브 링크
 */
test.describe('P3.6.3 마이페이지 보관함', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/mypage');
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });
  });

  test('마이페이지 성취 탭 — 그리드가 표시된다', async ({ page }) => {
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible({ timeout: 5_000 });
  });

  test('성취 배지 클릭 → 상세 패널이 표시된다', async ({ page }) => {
    await page.getByTestId('mypage-tab-achievements').click();
    await expect(page.getByTestId('achievement-grid')).toBeVisible({ timeout: 5_000 });

    // 첫 번째 배지 클릭
    const firstBadge = page.getByTestId('achievement-grid').locator('[data-testid^="badge-"]').first();
    const hasBadge = await firstBadge.isVisible().catch(() => false);
    if (!hasBadge) return; // 배지 없으면 스킵

    await firstBadge.click();
    await expect(page.getByTestId('achievement-detail')).toBeVisible({ timeout: 5_000 });
  });

  test('마이페이지 퀘스트 탭 — 퀘스트 목록이 표시된다', async ({ page }) => {
    await page.getByTestId('mypage-tab-quests').click();
    await expect(page.getByTestId('mypage-quests')).toBeVisible({ timeout: 5_000 });
  });

  test('마이페이지 성장 탭 — 성장 기록이 표시된다', async ({ page }) => {
    await page.getByTestId('mypage-tab-growth').click();
    await expect(page.getByTestId('mypage-growth')).toBeVisible({ timeout: 5_000 });
  });

  test('마이페이지 허브 — Garden 대시보드 링크가 있다', async ({ page }) => {
    const growthLink = page.getByTestId('go-growth-dashboard');
    await expect(growthLink).toBeVisible();
    await growthLink.click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
  });

  test('마이페이지 허브 — 캘린더 링크가 있다', async ({ page }) => {
    const calLink = page.getByTestId('mypage-hub-calendar');
    await expect(calLink).toBeVisible();
    await calLink.click();

    // 캘린더 또는 로딩 상태
    const isLoading = await page
      .getByTestId('growth-calendar-loading')
      .isVisible()
      .catch(() => false);
    if (!isLoading) {
      await expect(page.getByTestId('growth-calendar')).toBeVisible({ timeout: 10_000 });
    }
  });
});
