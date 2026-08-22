import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all Page Objects.
 * Encapsulates common page interactions, navigations, and web-first verifications.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to relative path using configured baseURL.
   */
  async navigate(path: string = ''): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for network idle or dom content loaded.
   */
  async waitForPageLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get current page URL.
   */
  getUrl(): string {
    return this.page.url();
  }

  /**
   * Assert page title matches expected.
   */
  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  /**
   * Assert current URL contains path or matches regex.
   */
  async expectUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }
}
