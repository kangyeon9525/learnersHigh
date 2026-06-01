import { test, expect } from '@playwright/test';

/**
 * P1.10.3 — 전체 UI 셸 네비게이션 스모크.
 * 6화면 라우트 진입 + 주요 인터랙션(타이머 모드/경고, 캘린더 드릴다운, 보관함 탭)을 검증한다.
 * 비즈니스 판정은 P2/P3에서 검증하므로 여기서는 화면·라우팅·data-testid만 확인한다.
 */
test.describe('P1 UI 셸 네비게이션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('사이드바로 5개 라우트 진입', async ({ page }) => {
    const nav = page.getByTestId('app-nav');
    await expect(nav).toBeVisible();

    await page.getByTestId('nav-timer').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();

    await page.getByTestId('nav-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible();
    await expect(page.getByTestId('growth-garden')).toBeVisible();

    await page.getByTestId('nav-mypage').click();
    await expect(page.getByTestId('mypage')).toBeVisible();

    await page.getByTestId('nav-report').click();
    await expect(page.getByTestId('daily-report')).toBeVisible();
    await expect(page.getByTestId('report-timeline')).toBeVisible();

    await page.getByTestId('nav-home').click();
    await expect(page.getByTestId('home-page')).toBeVisible();
  });

  test('성장 정원 → 캘린더 드릴다운', async ({ page }) => {
    await page.getByTestId('nav-growth').click();
    await page.getByTestId('go-calendar').click();
    await expect(page.getByTestId('growth-calendar')).toBeVisible();
    await expect(page.getByTestId('calendar-grid')).toBeVisible();

    await page.getByTestId('calendar-monthly').click();
    await expect(page.getByTestId('calendar-archive')).toBeVisible();

    await page.getByTestId('back-growth').click();
    await expect(page.getByTestId('growth-dashboard')).toBeVisible();
  });

  test('마이페이지 탭 전환 + 성취 상세', async ({ page }) => {
    await page.getByTestId('nav-mypage').click();

    await page.getByTestId('mypage-tab-quests').click();
    await expect(page.getByTestId('mypage-quests')).toBeVisible();

    await page.getByTestId('mypage-tab-growth').click();
    await expect(page.getByTestId('mypage-growth')).toBeVisible();

    await page.getByTestId('mypage-tab-achievements').click();
    const firstTile = page.getByTestId('achievement-grid').locator('.tile').first();
    await firstTile.click();
    await expect(page.getByTestId('achievement-detail')).toBeVisible();
  });

  test('타이머 모드 토글 + 이탈 경고(비차단) 토글', async ({ page }) => {
    await page.getByTestId('nav-timer').click();
    await expect(page.getByTestId('mode-timer')).toBeVisible();

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();

    // 이탈 시 모달로 멈추지 않고 인라인 경고만 노출 (타이머는 계속 동작)
    await page.getByTestId('simulate-distracted').click();
    await expect(page.getByTestId('focus-warning')).toBeVisible();
    await expect(page.getByTestId('timer-display')).toBeVisible();

    // 학습 중에는 정산 모달이 노출되지 않아야 한다 (집중 보호)
    await expect(page.getByTestId('session-result-modal')).toHaveCount(0);

    // 집중 복귀 시뮬레이션 → 경고 사라짐
    await page.getByTestId('simulate-distracted').click();
    await expect(page.getByTestId('focus-warning')).toHaveCount(0);
  });

  test('홈에서 학습 시작 진입', async ({ page }) => {
    await page.getByTestId('home-start-study').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
  });

  test('홈 학습 상태 배너·퇴실 모달·퀵링크', async ({ page }) => {
    await expect(page.getByTestId('study-status-banner')).toBeVisible();
    await expect(page.getByTestId('home-quick-links')).toBeVisible();
    await page.getByTestId('quick-report').click();
    await expect(page.getByTestId('daily-report')).toBeVisible();
    await page.getByTestId('nav-home').click();
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await page.getByTestId('nav-home').click();
    await page.getByTestId('home-check-out').click();
    await page.getByTestId('purpose-home').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('study-status-banner')).toHaveAttribute(
      'data-presence',
      'checked_out',
    );
  });

  test('타이머 이탈 팝업 UI (Figma 오버레이)', async ({ page }) => {
    await page.getByTestId('nav-timer').click();
    await page.getByTestId('start-study').click();
    await page.getByTestId('open-focus-modal').click();
    await expect(page.getByTestId('focus-warning-modal')).toBeVisible();
    await page.getByTestId('focus-resume').click();
    await expect(page.getByTestId('focus-warning-modal')).toHaveCount(0);
  });
});
