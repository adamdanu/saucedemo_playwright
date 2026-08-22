import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login - Validation', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC06: login with empty credentials shows validation error', { tag: ['@high'] }, async ({ page }) => {
    await loginPage.expectLoginPageVisible();

    await loginPage.login('', '');

    await loginPage.expectErrorMessage('Epic sadface: Username is required');
  });
});
