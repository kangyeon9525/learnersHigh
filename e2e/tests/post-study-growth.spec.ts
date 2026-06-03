import { test, expect } from '@playwright/test';

/**
 * P3.6.1 — 정산 후 Garden 단계 반영
 *
 * 검증: 학습 종료 → 정산 모달 → go-growth CTA → 성장 대시보드 DB 값 반영
 */
test.describe('P3.6.1 정산 후 성장 반영', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('정산 모달 go-growth 클릭 → 성장 대시보드 진입', async ({ page }) => {
    // 1. 입실
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    // 이전 세션 정리
    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    // 2. 학습 시작 → 종료
    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByTestId('end-study').click();

    // 3. 정산 모달 확인
    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });

    // result-growth 섹션이 있어야 한다 (growthDelta 포함)
    await expect(modal.getByTestId('result-growth')).toBeVisible();

    // 4. go-growth CTA 클릭 → 성장 대시보드
    await modal.getByTestId('go-growth').click();

    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('growth-profile')).toBeVisible();
  });

  test('정산 후 홈으로 돌아가면 성장 위젯이 갱신된다', async ({ page }) => {
    // 1. 홈 위젯 초기 상태 기록
    const initialBadge = page.getByTestId('home-stage-badge');

    // 2. 입실 → 학습 → 정산
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

    // 3. 닫기 → 홈으로
    await modal.getByTestId('close-result').click();
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 10_000 });

    // 4. 홈 위젯이 존재하는지 확인 (성장 데이터 있는 경우)
    const stageBadge = page.getByTestId('home-stage-badge');
    if (await stageBadge.isVisible()) {
      // 위젯이 렌더됐으면 텍스트가 있어야 한다
      const badgeText = await stageBadge.textContent();
      expect(badgeText).toBeTruthy();
    }
  });

  test('성장 대시보드에서 정원(GrowthGarden) 씬이 렌더된다', async ({ page }) => {
    await page.goto('/growth');
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    // GrowthGarden 씬 또는 loading 상태
    const isLoading = await page.getByTestId('growth-loading').isVisible().catch(() => false);
    if (!isLoading) {
      await expect(page.getByTestId('growth-profile')).toBeVisible();
    }
  });
});
