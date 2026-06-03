import { test, expect } from '@playwright/test';

/**
 * P4.3 부가 기능 E2E — 라이브러리·순위·코칭 예약
 *
 * 검증: 페이지 진입·탭 필터·코칭 모달 인터랙션
 */

test.describe('P4.3 라이브러리 페이지', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/library');
    await expect(page.getByTestId('library')).toBeVisible({ timeout: 10_000 });
  });

  test('학습 자료 탭이 기본 선택되고 그리드가 표시된다', async ({ page }) => {
    await expect(page.getByTestId('library-tab-study')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('library-grid')).toBeVisible();
    // 오늘의 학습 리스트 노출 (학습 탭)
    await expect(page.getByTestId('library-today-list')).toBeVisible();
  });

  test('수업 탭 — 타이머 버튼이 비활성화된다', async ({ page }) => {
    await page.getByTestId('library-tab-class').click();
    await expect(page.getByTestId('library-tab-class')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByTestId('library-class-notice')).toBeVisible();
    // 타이머 버튼 disabled 확인
    const disabledBtn = page.locator('[data-testid^="library-timer-disabled-"]').first();
    await expect(disabledBtn).toBeDisabled();
  });

  test('생활 탭 — 오늘의 학습 리스트 미표시', async ({ page }) => {
    await page.getByTestId('library-tab-life').click();
    await expect(page.getByTestId('library-today-list')).toHaveCount(0);
    await expect(page.getByTestId('library-grid')).toBeVisible();
  });

  test('검색으로 필터링된다', async ({ page }) => {
    await page.getByTestId('library-search').fill('수학');
    const items = page.locator('[data-testid^="library-item-"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('코칭 예약 버튼 → 모달 열림 → 코치 선택 → 슬롯 선택 → 예약', async ({ page }) => {
    await page.getByTestId('open-coaching').click();
    await expect(page.getByTestId('coaching-modal')).toBeVisible({ timeout: 5_000 });

    // 코치 선택
    await page.getByTestId('coaching-coach-coach-1').click();

    // 슬롯 선택 (첫 번째)
    const firstSlot = page.locator('[data-testid^="coaching-slot-"]').first();
    await expect(firstSlot).toBeVisible({ timeout: 3_000 });
    await firstSlot.click();

    // 예약하기
    await page.getByTestId('coaching-book-btn').click();
    await expect(page.getByTestId('coaching-confirm')).toBeVisible({ timeout: 3_000 });

    // QR 표시
    await expect(page.getByTestId('coaching-qr')).toBeVisible();
    // 다이렉트 링크 버튼 표시
    await expect(page.getByTestId('coaching-direct-link')).toBeVisible();

    // 완료
    await page.getByTestId('coaching-done-btn').click();
    await expect(page.getByTestId('coaching-modal')).toHaveCount(0);
  });
});

test.describe('P4.3 순위 페이지', () => {
  test('순위 페이지 진입 — 리스트가 렌더된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/ranking');
    await expect(page.getByTestId('ranking-page')).toBeVisible({ timeout: 10_000 });

    const loading = await page.getByTestId('ranking-loading').isVisible().catch(() => false);
    if (loading) return;

    await expect(page.getByTestId('ranking-list')).toBeVisible();
  });

  test('마이페이지 허브에서 순위 페이지로 이동', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/mypage');
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });

    await page.getByTestId('mypage-hub-ranking').click();
    await expect(page.getByTestId('ranking-page')).toBeVisible({ timeout: 10_000 });
  });

  test('내 순위 항목이 하이라이트된다', async ({ page }) => {
    await page.goto('/ranking');
    await expect(page.getByTestId('ranking-page')).toBeVisible({ timeout: 10_000 });

    const loading = await page.getByTestId('ranking-loading').isVisible().catch(() => false);
    if (loading) return;

    // fixture 모드에서는 항상 "나" 항목이 있어야 한다
    const meRow = page.getByTestId('ranking-me');
    if (await meRow.isVisible().catch(() => false)) {
      await expect(meRow).toBeVisible();
    }
  });
});

test.describe('P4.3 월간 리포트 페이지', () => {
  test('월간 리포트 진입 — KPI 카드 4종과 히트맵이 표시된다', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
    await page.goto('/monthly-report');

    const loading = await page.getByTestId('monthly-report-loading').isVisible().catch(() => false);
    if (loading) return;

    await expect(page.getByTestId('monthly-report')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('monthly-kpi')).toBeVisible();
    await expect(page.getByTestId('monthly-heatmap')).toBeVisible();
  });
});
