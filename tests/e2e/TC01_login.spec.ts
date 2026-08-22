import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
  });

  test('TC01: login with valid credentials', { tag: ['@critical', '@smoke'] }, async ({ page }) => {
    await loginPage.goto();
    await loginPage.expectLoginPageVisible();

    const username = process.env.STANDARD_USER!;
    const password = process.env.PASSWORD!;
    await loginPage.login(username, password);

    await inventoryPage.expectOnInventoryPage();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });
});
