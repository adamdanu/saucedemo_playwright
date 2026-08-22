import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Menu Navigation', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
  });

  test('TC14: menu Reset App State clears cart', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.addItemToCartById('sauce-labs-backpack');
    await inventoryPage.expectCartBadgeVisible();
    await inventoryPage.expectCartBadgeCount('1');

    await inventoryPage.openMenu();
    await inventoryPage.clickResetAppState();

    await inventoryPage.expectCartBadgeHidden();
  });
});
