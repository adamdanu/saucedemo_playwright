import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly checkoutCompleteHeader: Locator;
  readonly orderConfirmationMessage: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.checkoutCompleteHeader = page.locator('.complete-header');
    this.orderConfirmationMessage = page.locator('.complete-text');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async expectOnCheckoutStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
    await expect(this.page.locator('.header_secondary_container .title')).toContainText('Checkout: Your Information');
  }

  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  async expectOnCheckoutStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.page.locator('.header_secondary_container .title')).toContainText('Checkout: Overview');
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectOnCheckoutComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(this.checkoutCompleteHeader).toContainText('Thank you for your order!');
  }

  async expectOrderConfirmationMessage(text: string | RegExp): Promise<void> {
    await expect(this.orderConfirmationMessage).toContainText(text);
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutLink.click();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(/\/$/);
  }

  async expectErrorMessage(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
