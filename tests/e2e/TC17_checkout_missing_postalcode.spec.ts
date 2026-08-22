import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout - Form Validation', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await page.goto('/inventory.html');

    await inventoryPage.addItemToCartById('sauce-labs-backpack');
    await inventoryPage.openCart();
    await cartPage.clickCheckout();
  });

  test('TC17: checkout with missing postal code shows error', { tag: ['@high'] }, async ({ page }) => {
    await checkoutPage.expectOnCheckoutStepOne();

    await checkoutPage.fillCheckoutForm('John', 'Doe', '');
    await checkoutPage.clickContinue();

    await checkoutPage.expectErrorMessage('Error: Postal Code is required');
  });
});
