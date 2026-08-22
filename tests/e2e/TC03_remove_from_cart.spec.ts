import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Remove from Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    await page.goto('/inventory.html');
  });

  test('TC03: remove item from cart', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    // Precondition: add item to cart
    await inventoryPage.addItemToCartById('sauce-labs-backpack');
    await inventoryPage.expectCartBadgeVisible();
    await inventoryPage.expectCartBadgeCount('1');

    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();
    await cartPage.expectCartItemCount(1);

    // Remove item
    await cartPage.removeFirstItem();
    await cartPage.expectCartItemCount(0);
    await inventoryPage.expectCartBadgeHidden();
  });
});
