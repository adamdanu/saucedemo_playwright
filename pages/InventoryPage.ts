import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  readonly productsHeader: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly menuButton: Locator;
  readonly sortDropdown: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly closeMenuButton: Locator;
  readonly inventoryItems: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.productsHeader = page.locator('.header_secondary_container .title');
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.sortDropdown = page.locator('.product_sort_container');
    this.allItemsLink = page.locator('#inventory_sidebar_link');
    this.aboutLink = page.locator('#about_sidebar_link');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.resetAppStateLink = page.locator('#reset_sidebar_link');
    this.closeMenuButton = page.locator('#close_sidebar_link');
    this.inventoryItems = page.locator('.inventory_item_name');
    this.productPrices = page.locator('.inventory_item_price');
  }

  async expectOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.productsHeader).toContainText('Products');
  }

  async addItemToCartById(id: string): Promise<void> {
    await this.page.locator(`#add-to-cart-${id}`).click();
  }

  async removeItemFromCartById(id: string): Promise<void> {
    await this.page.locator(`#remove-${id}`).click();
  }

  async openCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }

  async expectCartBadgeCount(count: string): Promise<void> {
    await expect(this.shoppingCartBadge).toHaveText(count);
  }

  async expectCartBadgeVisible(): Promise<void> {
    await expect(this.shoppingCartBadge).toBeVisible();
  }

  async expectCartBadgeHidden(): Promise<void> {
    await expect(this.shoppingCartBadge).not.toBeVisible();
  }

  async openMenu(): Promise<void> {
    await this.menuButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.closeMenuButton.click();
  }

  async sortBy(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(sortOption);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.inventoryItems.allTextContents();
  }

  async getAllPrices(): Promise<string[]> {
    return this.productPrices.allTextContents();
  }

  async clickAllItems(): Promise<void> {
    await this.allItemsLink.click();
  }

  async clickResetAppState(): Promise<void> {
    await this.resetAppStateLink.click();
  }

  async clickAbout(): Promise<void> {
    await this.aboutLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }
}
