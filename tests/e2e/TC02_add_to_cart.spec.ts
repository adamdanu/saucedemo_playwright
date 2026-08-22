import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Add to Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    // Navigate to ensure authenticated state is on inventory page
    await page.goto('/inventory.html');
  });

  test('TC02: add item to cart and verify badge', { tag: ['@high'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.addItemToCartById('sauce-labs-backpack');
    await inventoryPage.expectCartBadgeVisible();
    await inventoryPage.expectCartBadgeCount('1');

    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();
    await cartPage.expectCartItemCount(1);
  });
});
