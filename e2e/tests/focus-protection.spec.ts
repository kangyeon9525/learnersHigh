import { test, expect } from '@playwright/test';

/**
 * P2.6.1 / P2.6.3 — 학습 중 집중 보호: 정산·성취 UI 미노출
 */
async function readyTimerForStudy(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('nav-timer').click();
  await expect(page.getByTestId('timer-page')).toBeVisible();
  await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });
  if (await page.getByTestId('end-study').isVisible()) {
    const reset = page.getByTestId('reset-study');
    if (await reset.isVisible()) await reset.click();
  }
  await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });
}

test.describe('집중 보호', () => {
  test.beforeEach(async ({ page }) => {
    await readyTimerForStudy(page);
  });

  test('학습 중 정산 모달 없음 + focus-protected', async ({ page }) => {
    await expect(page.getByTestId('timer-page')).toHaveAttribute('data-focus-protected', 'true');
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);
    await expect(page.getByTestId('result-milestones')).toHaveCount(0);
  });

  test('이탈 시 인라인 경고만 노출', async ({ page }) => {
    await page.getByTestId('start-study').click();
    await page.getByTestId('simulate-distracted').click();
    await expect(page.getByTestId('focus-warning')).toBeVisible();
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);
  });
});
