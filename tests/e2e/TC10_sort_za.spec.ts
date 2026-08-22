import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
  });

  test('TC10: sort products Z to A orders items reverse alphabetically', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    // Sort Z-A from default A-Z
    await inventoryPage.sortBy('za');

    const products = await inventoryPage.getAllProductNames();
    const sorted = [...products].sort().reverse();
    expect(products).toEqual(sorted);
  });
});
