import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
  });

  test('TC09: sort products A to Z orders items alphabetically', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    // First sort Z-A to ensure change
    await inventoryPage.sortBy('za');
    const productsReversed = await inventoryPage.getAllProductNames();

    // Sort A-Z
    await inventoryPage.sortBy('az');
    const productsAfter = await inventoryPage.getAllProductNames();
    const sorted = [...productsAfter].sort();

    expect(productsAfter).toEqual(sorted);
    expect(productsAfter).not.toEqual(productsReversed);
  });
});
