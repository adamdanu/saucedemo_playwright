# AI Automation Guidelines: Playwright (TypeScript + POM)

Universal guideline for all AI assistants (Antigravity, Cursor, Claude Code, GitHub Copilot, Windsurf, ChatGPT, etc.) working on this repository.

- Always refer to and follow deep-dive guides in [.agents/skills/playwright-skill/SKILL.md](.agents/skills/playwright-skill/SKILL.md).
- Check and update [MEMORY.md](MEMORY.md) when learning new repository quirks, persona edge cases, or user preferences.

---

## 1. Core Architecture & Tech Stack

- **Language**: TypeScript (`.ts`) for all tests, Page Objects, fixtures, and utilities.
- **Pattern**: Page Object Model (POM) strictly enforced.
- **Directory Layout**:
  ```
  pages/        -> Page Object classes (BasePage.ts, LoginPage.ts, etc.)
  fixtures/     -> Custom test fixtures (test-fixtures.ts)
  tests/        -> Feature-grouped spec files (tests/<feature>/TC{N}_{name}.spec.ts)
  utils/        -> Helpers, test data generators, API clients
  ```

---

## 2. Page Object Model (POM) Rules

1. **No Raw UI Locators in Tests**: Tests must NEVER call `page.locator(...)`, `page.getByRole(...)`, `page.click(...)`, or `page.fill(...)` directly.
2. **Inheritance**: All Page Objects must inherit from `BasePage` (`pages/BasePage.ts`).
3. **Constructor Locators**: Declare locators in constructor as typed `readonly <name>: Locator`. Expose them so tests can perform web-first `expect(page.locator)` assertions.
4. **Encapsulation**: Expose action methods (`login()`, `addToCart()`). Tests own test assertions (`expect(pageObject.errorMessage).toBeVisible()`).
5. **No Duplicate Methods**: Check existing Page Objects before creating new methods.

---

## 3. Locator Strategy (Priority Order)

1. `page.getByRole()` — preferred for interactive elements (buttons, links, headings, checkboxes).
2. `page.getByLabel()` — for labeled form controls.
3. `page.getByPlaceholder()` — for input fields with placeholder text.
4. `page.getByText()` — for static text elements, but prefer `getByRole()` with name option instead (see item 5).
5. `page.getByRole()` with `{ name: '...' }` — preferred for headings, labels, and any element where semantic role + text verification together is more robust than text alone:
   - **Best**: `page.getByRole('heading', { name: 'Products' })` — verifies role AND text
   - **Good**: `page.getByText('Thank you for your order!')` — acceptable for unique, static confirmation text
6. `page.getByTestId()` or `page.locator('[data-test="..."]')` — for test IDs.
7. **Strictly Prohibited**: Raw XPath selectors and fragile CSS paths (`div > div:nth-child(3)`).
8. **Avoid Ambiguous Selectors**: Generic CSS classes like `.title`, `.header`, `.label` may match multiple elements on the same page. Always scope or use semantic `getBy*()` variants instead:
   - **Bad**: `page.locator('.title')` — matches "Products", "Your Cart", "Main Menu", and "Checkout: Overview" simultaneously.
   - **Good**: `page.getByText('Products')` — matches exactly one element by its visible text.
   - **Good**: `page.locator('.header_secondary_container .title')` — scoped to the main header's `.title` span, excluding sidebar "Main Menu".
9. **No Duplicate Locators**: If the same element appears in both a constructor locator and an assertion, reuse the same named locator property — do not re-declare `page.locator('.title')` inline in assertion methods.

---

## 4. Assertions & Timing Rules

- **Web-First Assertions Only**: Auto-retrying `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`, `expect(page).toHaveURL()`.
- **No Hard Waits**: `page.waitForTimeout()` is strictly forbidden. Use auto-waiting or explicit state waits (`waitForLoadState`, `toBeVisible`).
- **Soft Assertions**: Use `expect.soft(...)` for multiple independent UI checks.
- **Polling**: Use `expect.poll(...)` when waiting on asynchronous backend/state conditions.

---

## 5. Test File Structure & Naming

- **1 Test Case Per File (Mandatory)**: Every `.spec.ts` file MUST contain exactly ONE test case. Never put multiple tests in a single file.
- **File Naming**: `tests/<suite>/TC{N}_{feature}_{action}.spec.ts` (e.g. `tests/auth/TC01_login_elements_visible.spec.ts`).
- **Describe Blocks**: Wrap test in `test.describe('<Feature Name>', () => { ... })`.
- **Test Titles**: Include test case ID and expected behavior: `test('TC01: login page elements are visible', async (...) => { ... })`.
- **Multi-Step Tests**: Use `test.step('<step description>', async () => { ... })` for tests with 3+ steps.
- **Strict Test Isolation & Independence**:
  - Every test case MUST be 100% self-contained and independent.
  - Tests must pass in any execution order, when run in parallel, or in isolation (`npx playwright test TC02...`).
  - Zero dependencies on previous tests: never assume previous test logged in, navigated, or created cart state.
  - Clean state: each test sets up its own preconditions via POM navigation or fixtures.

---

## 6. Test Data & Security

- **Scope**: Declare test variables inside `test.describe` or test body, never at module root scope.
- **Secrets in `.env`**: Credentials and sensitive data MUST come from `.env` via `process.env` (e.g. `process.env.STANDARD_USER!`). Never hardcode credentials or use fallback values (e.g. `|| 'standard_user'`) — the non-null assertion `!` enforces that `.env` must be configured.
- **Gitignore Secrets**: `.env` files MUST be listed in `.gitignore` and NEVER committed to version control.
- **Session Reuse (`storageState`)**: Standard user auth is pre-authenticated via `tests/setup/auth.setup.ts` and saved to `playwright/.auth/user.json`.
  - Feature tests (Cart, Inventory, Checkout) run logged-in by default.
  - Tests requiring clean/unauthenticated state (e.g. Login form tests, Lockout tests) must reset session at top of file:
    `test.use({ storageState: { cookies: [], origins: [] } });`

---

## 7. Test Completeness & Outcome Verification (Mandatory)

- **Prove Test Title Claim (No Incomplete Tests)**: The test body must 100% prove the expected outcome declared in the test title. Never stop after clicking a button or filling a form.
- **Login / Navigation Tests**: MUST verify destination URL (`expect(page).toHaveURL(...)`) AND visibility of key post-navigation UI element (e.g. products page header/inventory list).
- **Form / Creation Flows**: MUST verify success message, modal close, and new entity visible in the list/dashboard.
- **Error / Validation Tests**: MUST verify specific error message text (`expect(locator).toContainText(...)`), not just error container visibility.
- **State & Count Changes**: If title states "item added to cart" or "count updates", MUST explicitly assert badge counter value (`expect(cartBadge).toHaveText('1')`).

---

## 8. Risk-Based Testing Tags

All tests MUST include risk-based tags using Playwright's `{ tag: [...] }` option to enable selective test execution.

- **Tag Format**: `{ tag: ['@risk-level', '@category'] }`
- **Risk Levels** (pick one):
  - `@critical` — Core flows with high business impact (login, checkout, payment). Run on every CI commit.
  - `@high` — Key user journeys with significant impact if broken (add to cart, order placement).
  - `@medium` — Secondary features with moderate impact (remove from cart, form validation).
  - `@low` — Edge cases and minor features (logout, UI polish checks).
- **Category Tags** (optional, additive):
  - `@smoke` — Fast subset that validates the build is worth running full suite against.
  - `@regression` — Full functional coverage suite.

**Example**:
```typescript
test('TC01: login with valid credentials', { tag: ['@critical', '@smoke'] }, async ({ page }) => { ... });
test('TC04: complete checkout flow', { tag: ['@critical'] }, async ({ page }) => { ... });
```

**Selective Execution Commands**:
```bash
# Run critical + smoke only
npx playwright test --grep "@critical"

# Skip low priority in CI
npx playwright test --grep "@low" --grep-invert
```

---

## 9. Common Commands

- Run all tests: `npm test`
- Run headed: `npm run test:headed`
- Run UI mode: `npm run test:ui`
- Run debug: `npm run test:debug`
- View report: `npm run test:report`
