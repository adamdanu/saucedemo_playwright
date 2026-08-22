import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import fs from 'fs';
import path from 'path';

const authFile = path.resolve(__dirname, '../../playwright/.auth/user.json');

setup('authenticate standard user', async ({ page }) => {
  // Ensure storage directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();

  const user = process.env.STANDARD_USER!;
  const password = process.env.PASSWORD!;

  await loginPage.login(user, password);
  await expect(page).toHaveURL(/inventory\.html/);

  // Save authenticated state to file
  await page.context().storageState({ path: authFile });
});
