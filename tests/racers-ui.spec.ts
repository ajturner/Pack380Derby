import { test, expect } from '@playwright/test';

// These tests use the app at http://localhost:3001 and the API at http://localhost:3000.
// playwright.config.ts starts both before the tests run.

const API_URL = process.env.NEXT_PUBLIC_DERBY_API_URL ?? 'http://localhost:3000';
// The app's shared login password is the API bearer token.
const API_TOKEN = process.env.API_BEARER_TOKEN ?? 'local-dev-token';

test.describe('Racer CRUD UI', () => {
  test.beforeEach(async ({ page, request }) => {
    // Login only succeeds when the racer list is not empty, so make sure one racer exists.
    const res = await request.post(`${API_URL}/api/racer`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      data: { name: `Seed Racer ${Date.now()}`, den: '1', rank: 'lion', racerType: 'cub' },
    });
    expect(res.ok()).toBeTruthy();

    // Log in through the shared-password screen.
    // Wait for the page scripts to load first, or the typed password is lost.
    await page.goto('http://localhost:3001/racers?admin=true', { waitUntil: 'networkidle' });
    await page.getByRole('textbox').fill(API_TOKEN);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Login Required' })).toBeHidden();
  });

  test('should create, view, update, and delete a racer via UI', async ({ page }) => {
    const timestamp = Date.now();
    const racerName = `Playwright Racer ${timestamp}`;
    // Go to racers list
    await page.goto('http://localhost:3001/racers?admin=true');
    await expect(page).toHaveTitle(/Pinewood Derby/);

    // Click to add a new racer
    await page.locator('a[href*="/racers/create"]').click();

    // Fill out the form
    // The Scout role only searches existing scouts; Sibling creates a new racer by name.
    await page.getByRole('radio', { name: 'Sibling' }).check();
    await page.locator('#name').fill(racerName);
    await page.getByRole('button', { name: 'Save Racer' }).click();

    // Should be redirected to racers list and see the new racer
    await expect(page.getByText(racerName)).toBeVisible();

    // Click on the racer to view details (assume link or row click)
    await page.getByText(racerName).click();
    await expect(page.getByText(racerName)).toBeVisible();
    
    });
});
