import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.removeButtons = page.locator('button:has-text("Remove")');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.cartQuantity = page.locator('.cart_quantity');
  }

  async expectOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
    await expect(this.page.locator('.header_secondary_container .title')).toContainText('Your Cart');
  }

  async expectCartItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async removeFirstItem(): Promise<void> {
    await this.removeButtons.first().click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
