import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Inventory - Menu Navigation', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await page.goto('/inventory.html');
  });

  test('TC13: menu All Items link navigates to inventory page', { tag: ['@low'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    // Navigate away first (to cart)
    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();

    // Open menu and click All Items
    await inventoryPage.openMenu();
    await inventoryPage.clickAllItems();

    await inventoryPage.expectOnInventoryPage();
  });
});
