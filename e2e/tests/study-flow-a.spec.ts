import { test, expect } from '@playwright/test';

/**
 * P2.6.2 — A파트 핵심: 입실 → 타이머 → 종료 → 서버 정산 모달
 */
test.describe('P2 A파트 학습 흐름', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('입실 → 학습 시작·종료 → 정산 모달', async ({ page }) => {
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });
    if (await page.getByTestId('end-study').isVisible()) {
      const reset = page.getByTestId('reset-study');
      if (await reset.isVisible()) await reset.click();
    }
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.getByTestId('progress-input').evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '4';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(800);
    await page.getByTestId('end-study').click();

    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByTestId('result-growth')).toBeVisible();
  });
});
