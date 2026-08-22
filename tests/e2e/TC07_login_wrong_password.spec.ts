import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login - Validation', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC07: login with wrong password shows error', { tag: ['@high'] }, async ({ page }) => {
    await loginPage.expectLoginPageVisible();

    const username = process.env.STANDARD_USER!;
    const wrongPassword = 'wrongpassword';
    await loginPage.login(username, wrongPassword);

    await loginPage.expectErrorMessage('Epic sadface: Username and password do not match any user in this service');
  });
});
