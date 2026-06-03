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
    // 이 테스트는 타이머 직접 접근 경로를 검증한다
    // 병렬 테스트 간 세션 간섭을 피하기 위해 홈 → 체크인 → 타이머 경로를 사용
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });
    const reset = page.getByTestId('reset-study');
    if (await reset.isVisible()) {
      await reset.click();
      await expect(reset).toHaveCount(0, { timeout: 15_000 });
    }
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    // 집중 보호 속성 확인
    await expect(page.getByTestId('timer-page')).toHaveAttribute('data-focus-protected', 'true');

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('timer-display')).toBeVisible();
    await expect(page.getByTestId('session-result-modal')).not.toBeVisible();

    // 정리
    await page.getByTestId('end-study').click();
    await expect(page.getByTestId('session-result-modal')).toBeVisible({ timeout: 15_000 });
    await page.getByTestId('close-result').click();
  });
});
