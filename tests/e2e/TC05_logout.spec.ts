import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Logout', () => {
  let inventoryPage: InventoryPage;
  let checkoutPage: CheckoutPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    checkoutPage = new CheckoutPage(page);
    loginPage = new LoginPage(page);
    await page.goto('/inventory.html');
  });

  test('TC05: logout from inventory page', { tag: ['@low'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.openMenu();
    await checkoutPage.clickLogout();
    await checkoutPage.expectLoggedOut();
    await loginPage.expectLoginPageVisible();
  });
});
