import { test, expect } from '@playwright/test';

test.describe('학습 루프 → 종료 정산', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('학습 시작·종료 후 정산 모달 노출', async ({ page }) => {
    await page.goto('/timer');
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('timer-display')).toBeVisible();

    await page.waitForTimeout(1500);
    await page.getByTestId('end-study').click();

    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText('오늘 학습 완료!')).toBeVisible();
  });

  test('성장 대시보드 조회', async ({ page }) => {
    await page.getByRole('link', { name: '성장 정원' }).click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible();
    await expect(page.getByTestId('growth-garden')).toBeVisible();
  });
});
