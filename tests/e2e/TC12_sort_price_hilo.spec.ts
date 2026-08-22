import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Inventory - Sorting', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    await page.goto('/inventory.html');
  });

  test('TC12: sort products price high to low orders by descending price', { tag: ['@medium'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getAllPrices();
    const priceValues = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...priceValues].sort((a, b) => b - a);
    expect(priceValues).toEqual(sorted);
  });
});
