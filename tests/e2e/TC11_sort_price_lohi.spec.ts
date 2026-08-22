import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
  });

  test('TC11: sort products price low to high orders by ascending price', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getAllPrices();
    const priceValues = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...priceValues].sort((a, b) => a - b);
    expect(priceValues).toEqual(sorted);
  });
});
