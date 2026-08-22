import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login - Validation', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC08: login with locked out user shows error', { tag: ['@medium'] }, async ({ page }) => {
    await loginPage.expectLoginPageVisible();

    const lockedUser = process.env.LOCKED_OUT_USER!;
    const password = process.env.PASSWORD!;
    await loginPage.login(lockedUser, password);

    await loginPage.expectErrorMessage('Epic sadface: Sorry, this user has been locked out.');
  });
});
