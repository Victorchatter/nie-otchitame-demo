import { test, expect } from '@playwright/test';

test.describe('Nie Otchitame Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with header and dashboard', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Nie Otchitame Dashboard' })).toBeVisible();
    await expect(page.getByTestId('dashboard')).toBeVisible();
    await expect(page.getByLabel('Report form')).toBeVisible();
  });

  test('adds a report and it appears in the list', async ({ page }) => {
    const timestamp = Date.now();
    const title = `Test report ${timestamp}`;

    await page.getByTestId('report-title-input').fill(title);
    await page.getByTestId('report-amount-input').fill('1234.56');
    await page.getByTestId('report-date-input').fill('2026-06-20');
    await page.getByTestId('report-status-select').selectOption('approved');

    await page.getByTestId('report-submit-btn').click();

    await expect(page.getByText(title, { exact: false })).toBeVisible();
    await expect(page.getByTestId('reports-table')).toContainText('approved');
  });

  test('metrics update after adding a report', async ({ page }) => {
    const countBefore = await page.getByTestId('metric-count').textContent();
    const amountBefore = await page.getByTestId('metric-total').textContent();

    const title = `Metrics report ${Date.now()}`;
    await page.getByTestId('report-title-input').fill(title);
    await page.getByTestId('report-amount-input').fill('999.99');
    await page.getByTestId('report-date-input').fill('2026-06-20');
    await page.getByTestId('report-status-select').selectOption('submitted');

    await page.getByTestId('report-submit-btn').click();

    await expect(page.getByText(title, { exact: false })).toBeVisible();

    const countAfter = await page.getByTestId('metric-count').textContent();
    const amountAfter = await page.getByTestId('metric-submitted').textContent();

    expect(countAfter).not.toEqual(countBefore);
    expect(amountAfter).not.toEqual(amountBefore);
  });
});
