import { test, expect } from '@playwright/test';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    await page.goto('/inventory.html');
  });

  test('TC04: complete checkout flow with name, address, and order', { tag: ['@critical', '@smoke'] }, async ({ page }) => {
    await inventoryPage.expectOnInventoryPage();

    // Precondition: add item to cart
    await inventoryPage.addItemToCartById('sauce-labs-backpack');
    await inventoryPage.expectCartBadgeVisible();

    // Navigate to cart
    await inventoryPage.openCart();
    await cartPage.expectOnCartPage();
    await cartPage.expectCartItemCount(1);

    // Step 1: Proceed to checkout
    await cartPage.clickCheckout();
    await checkoutPage.expectOnCheckoutStepOne();

    // Step 2: Fill checkout form (name, address)
    await checkoutPage.fillCheckoutForm('John', 'Doe', '10001');
    await checkoutPage.clickContinue();
    await checkoutPage.expectOnCheckoutStepTwo();

    // Step 3: Complete order
    await checkoutPage.clickFinish();
    await checkoutPage.expectOnCheckoutComplete();
    await expect(checkoutPage.checkoutCompleteHeader).toHaveText('Thank you for your order!');
  });
});
