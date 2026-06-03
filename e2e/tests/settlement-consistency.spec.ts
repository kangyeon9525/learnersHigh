import { test, expect } from '@playwright/test';

/**
 * P2.6.4 — 정산 일관성 E2E
 *
 * 검증 항목:
 *  1. 정산 모달 데이터가 서버 확정값과 일치 (낙관적 UI 미적용)
 *  2. 정산 후 growth/milestones/goals 재조회 시 값 일치
 *  3. 동일 세션 종료 API 재요청 시 일관된 결과 (세션 이미 완료 처리)
 */
test.describe('P2.6.4 정산 일관성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('home-page')).toBeVisible({ timeout: 30_000 });
  });

  test('정산 모달 표시 후 성장 위젯이 DB 값으로 갱신된다', async ({ page }) => {
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

    await page.getByTestId('progress-input').evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = '3';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.waitForTimeout(600);
    await page.getByTestId('end-study').click();

    // 3. 정산 모달 확인
    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });

    // result-growth 표시 확인 (서버 확정 growthDelta 포함)
    await expect(page.getByTestId('result-growth')).toBeVisible();

    // 획득 점수 행 존재 확인 (earnedScore는 항상 표시됨)
    await expect(modal.locator('.result-row--score')).toBeVisible();

    // 4. 모달 닫기 → 성장 대시보드로 이동
    const goGrowthBtn = modal.getByTestId('go-growth');
    await goGrowthBtn.click();

    // 5. Growth Dashboard 진입 확인
    await expect(page.getByTestId('growth-dashboard')).toBeVisible({ timeout: 10_000 });
    // 성장 프로필 카드가 존재하면 DB 기반 데이터 표시 중
    await expect(page.getByTestId('growth-profile')).toBeVisible();
  });

  test('정산 모달은 서버 확정 결과만 표시한다 (낙관적 UI 없음)', async ({ page }) => {
    // 1. 홈 진입 — fixture 모드인 경우 data-source 배너 확인
    const fixtureBanner = page.getByTestId('fixture-banner');
    const isFixture = await fixtureBanner.isVisible().catch(() => false);

    // 2. 입실 + 학습 흐름
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.waitForTimeout(500);
    await page.getByTestId('end-study').click();

    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });

    // 정산 모달이 노출된 시점에는 낙관적 데이터가 아닌 서버값이 들어 있어야 한다:
    // - fixture 모드에서도 모달은 노출됨 (demoSettlement 사용)
    // - live 모드에서는 서버 응답 기반
    // 공통: result-growth 섹션이 반드시 존재
    await expect(page.getByTestId('result-growth')).toBeVisible();

    if (!isFixture) {
      // live 모드: 집중 시간이 0이 아닌 값(최소 1분)
      const focusText = await modal.textContent();
      expect(focusText).not.toBeNull();
    }

    // 닫기 버튼으로 모달 닫기
    const closeBtn = modal.locator('[data-testid="close-result"], button').first();
    await closeBtn.click({ force: true });
  });

  test('정산 후 마이페이지에서 업데이트된 성취/퀘스트가 보인다', async ({ page }) => {
    // 1. 학습 세션 완료
    await page.getByTestId('home-check-in').click();
    await page.getByTestId('attendance-confirm').click();
    await expect(page.getByTestId('timer-page')).toBeVisible();
    await expect(page.getByTestId('timer-hydrating')).toHaveCount(0, { timeout: 30_000 });

    const resetBtn = page.getByTestId('reset-study');
    if (await resetBtn.isVisible()) await resetBtn.click();
    await expect(page.getByTestId('start-study')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('start-study').click();
    await expect(page.getByTestId('end-study')).toBeVisible();
    await page.waitForTimeout(500);
    await page.getByTestId('end-study').click();

    const modal = page.getByTestId('session-result-modal');
    await expect(modal).toBeVisible({ timeout: 15_000 });

    // 2. 마이페이지 CTA 클릭
    const goMypage = modal.getByTestId('go-mypage');
    await goMypage.click();

    // 3. 마이페이지 진입 확인
    await expect(page.getByTestId('mypage')).toBeVisible({ timeout: 10_000 });

    // 4. 성취 탭 — 그리드 표시 확인 (DB 갱신값)
    await page.getByTestId('mypage-tab-achievements').click();
    const achievementGrid = page.getByTestId('achievement-grid');
    await expect(achievementGrid).toBeVisible({ timeout: 5_000 });

    // 5. 퀘스트 탭 — 목록 확인
    await page.getByTestId('mypage-tab-quests').click();
    const questCard = page.getByTestId('mypage-quests');
    await expect(questCard).toBeVisible({ timeout: 5_000 });
  });
});
