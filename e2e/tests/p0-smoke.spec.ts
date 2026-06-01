import { test, expect } from '@playwright/test';

test.describe('P0 스모크 — 인프라·네비·집중 보호', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('4개 주요 라우트 로드', async ({ page }) => {
    const nav = page.getByTestId('app-nav');
    await expect(nav).toBeVisible();

    await nav.getByRole('link', { name: '학습', exact: true }).click();
    await expect(page.getByTestId('timer-page')).toBeVisible();

    await nav.getByRole('link', { name: '성장 정원' }).click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible();

    await nav.getByRole('link', { name: '마이', exact: true }).click();
    await expect(page.getByTestId('mypage')).toBeVisible();

    await nav.getByRole('link', { name: '홈', exact: true }).click();
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('학습 중 정산 모달 미노출 (집중 보호)', async ({ page }) => {
    await page.goto('/timer');
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('timer-display')).toBeVisible();
    await expect(page.getByTestId('session-result-modal')).not.toBeVisible();
  });
});
