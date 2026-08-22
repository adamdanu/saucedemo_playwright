# SauceDemo Playwright E2E Test Suite
Playwright E2E test suite for [SauceDemo](https://www.saucedemo.com) — built with TypeScript, Page Object Model (POM), and AI-assisted testing infrastructure.

---

## Table of Contents

1. [Setup](#1-setup)
2. [Run Tests](#2-run-tests)
3. [Architecture](#3-architecture)
4. [AI-Assisted Testing](#4-ai-assisted-testing)
5. [Rules](#5-rules)
6. [Skills](#6-skills)
7. [MCP (Model Context Protocol)](#7-mcp-model-context-protocol)
8. [Memory System](#8-memory-system)
9. [Test Coverage](#9-test-coverage)
10. [GitHub Actions CI/CD](#10-github-actions-cicd)

---

## 1. Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Install dependencies

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
BASE_URL=https://www.saucedemo.com

# Standard users
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PROBLEM_USER=problem_user
ERROR_USER=error_user
PASSWORD=secret_sauce
```

> **Important**: `.env` is gitignored. Never commit credentials.

### Install playwright

```bash
npx playwright install
```

---

## 2. Run Tests

### All tests (all browsers)

```bash
npm test
```

### Run by browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run by tag (risk-based)

```bash
# Critical tests only (login, checkout)
npx playwright test --grep "@critical"

# Smoke tests (fast sanity check)
npx playwright test --grep "@smoke"

# High priority only
npx playwright test --grep "@high"

# Skip low priority tests
npx playwright test --grep "@low" --grep-invert
```

### Visual testing modes

```bash
npm run test:headed       # Run with visible browser
npm run test:ui           # Playwright UI mode (interactive)
npm run test:debug        # Debug mode with breakpoints
npm run test:report       # View HTML report
```

### Run a single test

```bash
npx playwright test tests/e2e/TC01_login.spec.ts
```

### Run with trace on

```bash
npx playwright test tests/e2e/TC01_login.spec.ts --trace on
```

---

## 3. Architecture

### Directory Structure

```
saucedemo_playwright/
├── pages/                    # Page Object Model (POM)
│   ├── BasePage.ts          # Base class with shared methods
│   ├── LoginPage.ts         # Login page locators & actions
│   ├── InventoryPage.ts     # Products page locators & actions
│   ├── CartPage.ts         # Cart page locators & actions
│   └── CheckoutPage.ts      # Checkout pages locators & actions
│
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts   # Pre-authenticates standard_user
│   └── e2e/                # One test file per test case
│       ├── TC01_login.spec.ts
│       ├── TC02_add_to_cart.spec.ts
│       └── ...
│
├── fixtures/
│   └── test-fixtures.ts     # Custom Playwright fixtures
│
├── playwright.config.ts      # Playwright configuration
├── .env                     # Environment variables (gitignored)
├── .env.example             # Template for .env
└── AGENTS.md               # AI assistant rules
```

### Page Object Model (POM)

Every page has a corresponding Page Object class:

```
Test ──────► Page Object ──────► BasePage
                 │                    │
                 ├── locators         ├── navigate()
                 ├── actions          ├── expectUrl()
                 └── assertions       └── waitForPageLoaded()
```

**Example flow:**

```typescript
// Test (tests/e2e/TC01_login.spec.ts)
test('TC01: login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);
});

// Page Object (pages/LoginPage.ts)
export class LoginPage extends BasePage {
  readonly usernameInput = page.getByPlaceholder('Username');
  readonly passwordInput = page.getByPlaceholder('Password');
  readonly loginButton = page.getByRole('button', { name: 'Login' });

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Authentication Flow

Tests use `storageState` for fast, repeatable authentication:

```
tests/setup/auth.setup.ts
         │
         ▼
  Login with credentials
         │
         ▼
  Save session to playwright/.auth/user.json
         │
         ▼
  All test projects load this session
         │
         ▼
  Tests skip login, start directly on protected pages
```

Tests that need fresh/unauthenticated state reset explicitly:

```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

---

## 4. AI-Assisted Testing

This repo is designed for AI assistants (Claude Code, Copilot, etc.) to work alongside humans. AI assistants read the rules and memory to understand project conventions before making changes.

### How AI assistance works

```
Human asks AI ──► AI reads AGENTS.md ──► AI reads relevant memory ──► AI applies rules ──► AI writes code
```

### What AI assistants do

| Task | Example |
|------|---------|
| Create new tests | "Add test for checkout with empty cart" |
| Explore app behavior | Use Playwright MCP to discover elements and flows |
| Fix failing tests | Analyze error and update locators/methods |
| Refactor pages | Add new methods to Page Objects |
| Review code | Check locator strategy, assertions, POM compliance |

### How to invoke AI assistance

Just ask to AI, it will read the rules and memory to understand project conventions before making changes.

---

## 5. Rules

The rules in `AGENTS.md` are the source of truth for all AI assistants working in this repo.

### Key rules summary

| Rule | Description |
|------|-------------|
| **1 test per file** | One `test()` per `.spec.ts` file |
| **POM strict** | No raw `page.locator()` in tests — use Page Objects |
| **Locator priority** | `getByRole()` > `getByLabel()` > `getByPlaceholder()` > `getByText()` |
| **No hard waits** | Never use `page.waitForTimeout()` |
| **Web-first assertions** | Use `expect(locator).toBeVisible()` not `page.waitForSelector()` |
| **Secrets from .env** | Credentials via `process.env.VAR!` — no hardcoded fallbacks |
| **Risk tags** | Every test has `@critical`, `@high`, `@medium`, or `@low` tag |
| **Prove the claim** | Test title must match what the test actually verifies |

### Rule enforcement

- `forbidOnly: true` in CI — prevents committing `test.only`
- Non-null assertion `!` enforces `.env` is configured
- Tests run in parallel to catch state-dependent bugs

---

## 6. Skills

Skills are deep-dive guides that AI assistants load for specific topics.

### Skill: playwright-skill

**Location**: `.agents/skills/playwright-skill/`

AI assistants load this skill for guidance on:
- Locator strategy (CSS vs semantic selectors)
- POM best practices
- Auth patterns (storageState, cookies)
- Debugging flaky tests
- CI/CD integration
- API testing
- Visual regression

### Skill structure

```
.agents/skills/playwright-skill/
├── SKILL.md              # Overview + index
├── core/                 # Core concepts
│   ├── locators.md
│   ├── assertions.md
│   ├── fixtures.md
│   └── ...
├── pom/                  # Page Object Model guides
│   ├── page-object-model.md
│   └── pom-vs-fixtures.md
├── ci/                   # CI/CD guides
│   ├── github-actions.md
│   └── parallel-sharding.md
└── playwright-cli/       # CLI/browser automation
```

### When skills load

AI assistants load skills:
1. Automatically when AI assistant initializes in the project
2. On-demand when working on specific tasks (e.g., "write API tests")

---

## 7. MCP (Model Context Protocol)

The Playwright MCP server enables AI assistants to explore and interact with the app directly in a real browser.

### MCP capabilities

| Capability | What it does |
|-----------|-------------|
| `browser_navigate` | Open a URL |
| `browser_snapshot` | Capture page accessibility tree |
| `browser_click` | Click an element |
| `browser_fill` | Fill a form field |
| `browser_run_code` | Execute arbitrary Playwright code |
| `browser_screenshot` | Take a screenshot |
| `browser_console_messages` | Read browser console logs |

### How MCP is used

```bash
# AI assistant opens browser to SauceDemo
mcp__playwright__browser_navigate("https://www.saucedemo.com")

# AI assistant takes snapshot to see page structure
mcp__playwright__browser_snapshot()

# AI assistant fills login form
mcp__playwright__browser_fill_form([...])

# AI assistant clicks login
mcp__playwright__browser_click("button 'Login'")
```

### MCP workflow

```
1. Explore app ──► Discover elements & flows
         │
2. Verify behaviors ──► Test error messages, validations, edge cases
         │
3. Generate test cases ──► Create .spec.ts files based on findings
         │
4. Validate locators ──► Confirm selectors work before writing tests
```

### MCP for debugging

```bash
# Navigate to failing state
mcp__playwright__browser_navigate("https://www.saucedemo.com/cart.html")

# Check console errors
mcp__playwright__browser_console_messages("error")

# Inspect element
mcp__playwright__browser_snapshot()
```

---

## 8. Memory System

Memory files store project-specific knowledge that AI assistants load on each session.

### Why memory matters

Without memory, AI assistants repeat the same questions. With memory, they remember:
- Which users exist and their behaviors
- Cart/badge quirks
- User preferences for test style
- Project-specific rules beyond AGENTS.md

### Memory structure

```
.agents/memory/
├── MEMORY.md           # Index of topic files
├── auth-quirks.md      # Login errors, lockout behavior
├── inventory-cart.md   # Product names, sort order, badge rules
├── user-personas.md    # Problem/glitch/visual user traits
└── preferences.md      # 1 test/file, assertion style
```

### MEMORY.md index

```markdown
| Topic | File | Scope |
|---|---|---|
| 🔐 Authentication | auth-quirks.md | Logins, error banners, lockouts |
| 🛒 Inventory & Cart | inventory-cart.md | Products, sorting, cart badges |
| 👤 User Personas | user-personas.md | Problem, glitch, visual users |
| ⚙️ Preferences | preferences.md | 1 test/file, POM rules |
```

### Updating memory

When AI learns something new about the project, it appends to the relevant memory file:

```markdown
## New finding (2024-01-15)

Inventory badge only shows when items > 0. When badge is 0, the element is hidden, not visible with "0".
```

### How AI uses memory

```
AI starts session
      │
      ▼
Reads MEMORY.md (index)
      │
      ▼
Loads relevant topic files
      │
      ▼
Applies knowledge to work
```

---

## 9. Test Coverage

### Current test suite

| # | Test | Tag | Description |
|---|------|-----|-------------|
| TC01 | Login - valid credentials | `@critical`, `@smoke` | Login and verify inventory page |
| TC02 | Add to cart - badge | `@high` | Add item, verify badge count |
| TC03 | Remove from cart | `@medium` | Add then remove, verify empty cart |
| TC04 | Checkout flow | `@critical`, `@smoke` | Complete order end-to-end |
| TC05 | Logout | `@low` | Open menu, logout, verify login page |
| TC06 | Login - empty credentials | `@high` | Error on empty username/password |
| TC07 | Login - wrong password | `@high` | Error on wrong credentials |
| TC08 | Login - locked user | `@medium` | Error on locked_out_user |
| TC09 | Sort A to Z | `@medium` | Verify alphabetical sort |
| TC10 | Sort Z to A | `@medium` | Verify reverse alphabetical sort |
| TC11 | Sort price low to high | `@medium` | Verify price ascending |
| TC12 | Sort price high to low | `@medium` | Verify price descending |
| TC13 | Menu - All Items | `@low` | Navigate back to inventory |
| TC14 | Menu - Reset App State | `@medium` | Clear cart state |
| TC15 | Checkout - missing first name | `@high` | Validation error |
| TC16 | Checkout - missing last name | `@high` | Validation error |
| TC17 | Checkout - missing postal code | `@high` | Validation error |

**17 test cases × 3 browsers = 51 tests total**

### Test execution by priority

```bash
# Critical + Smoke (fast, ~10s)
npx playwright test --grep "@critical"

# All high priority (~20s)
npx playwright test --grep "@high"

# Full suite (~30s)
npm test
```

### Adding new tests

1. Explore the app with Playwright MCP to understand the flow
2. Create a new Page Object if needed, or add methods to existing pages
3. Create test file: `tests/e2e/TC{NN}_{feature}.spec.ts`
4. Add risk-based tag
5. Verify: `npx playwright test tests/e2e/TC{NN}_*.spec.ts`

---

## 10. GitHub Actions CI/CD

### Workflows

| Workflow | File | Trigger | Purpose |
|---------|------|---------|---------|
| Playwright Tests | `test.yml` | PR open, manual | Run all tests, upload report |
| Deploy Report | `deploy-report.yml` | Manual | Deploy latest report to GitHub Pages |

### Setup

#### 1. Add repository variables

Go to **Settings → Variables and secrets → Repository variables**:

| Variable | Value |
|----------|-------|
| `BASE_URL` | `https://www.saucedemo.com` |
| `STANDARD_USER` | `standard_user` |
| `LOCKED_OUT_USER` | `locked_out_user` |
| `PROBLEM_USER` | `problem_user` |
| `ERROR_USER` | `error_user` |
| `VISUAL_USER` | `visual_user` |

#### 2. Add repository secret

Go to **Settings → Variables and secrets → Repository secrets**:

| Secret | Value |
|--------|-------|
| `PASSWORD` | `secret_sauce` |

#### 3. Enable GitHub Pages

Go to **Settings → Pages → Source**:

- Source: **GitHub Actions**
- (No need to select a branch — workflows deploy directly)

### Trigger options

#### On Pull Request (automatic)
Tests run on every PR open, sync, or reopen to `main`.

#### Manual trigger
Go to **Actions → Playwright Tests → Run workflow**:

| Input | Description | Example |
|-------|-------------|---------|
| `test_tags` | Run only tagged tests | `@critical` |
| (leave empty) | Run all tests | — |

### Viewing reports

After a run completes, the report is automatically deployed to:
```
https://<username>.github.io/<repo-name>/
```

Or manually trigger **Deploy Report** workflow to redeploy the latest artifact.

### Workflow diagram

```
PR opened / Manual trigger
        │
        ▼
┌──────────────────────────────────────┐
│         test.yml                       │
│                                       │
│  ┌─────────────────────────────────┐   │
│  │ test (chromium)                 │   │
│  │  • npm ci                       │   │
│  │  • playwright install --with-deps │   │
│  │  • npx playwright test           │   │
│  │  • Upload report artifact        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ test (firefox)                  │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ test (webkit)                   │   │
│  └─────────────────────────────────┘   │
│                                       │
│  test-summary                        │
│  • Merge all reports                 │
│  • Upload merged artifact             │
│                                       │
│  deploy-report                       │
│  • Deploy to GitHub Pages            │
└──────────────────────────────────────┘
        │
        ▼
  GitHub Pages: test-report/
```

### Retry failed tests in CI

```bash
npx playwright test --project=chromium --retries=2
```

Retries are already configured in `playwright.config.ts`:
```typescript
retries: process.env.CI ? 2 : 0,
```

---

## Appendix: Quick Reference

### File naming convention

```
TC{NN}_{feature}_{action}.spec.ts
TC01_login.spec.ts
TC02_add_to_cart.spec.ts
TC04_checkout_flow.spec.ts
```

### Tag meanings

| Tag | When to run | Example |
|-----|-------------|---------|
| `@critical` | Every commit | Login, checkout, payment |
| `@high` | Every commit | Add to cart, form validation |
| `@medium` | Before release | Sorting, remove, filters |
| `@low` | Weekly | UI polish, edge cases |
| `@smoke` | On every PR | Fast sanity check |
| `@regression` | Full release | Complete suite |

### Browser support

| Browser | Project name | Notes |
|---------|-------------|-------|
| Chrome | `chromium` | Primary testing |
| Firefox | `firefox` | Cross-browser |
| Safari | `webkit` | macOS/iOS |

### Playwright config highlights

```typescript
// playwright.config.ts
{
  baseURL: 'https://www.saucedemo.com',  // No hardcoded URLs
  retries: process.env.CI ? 2 : 0,      // Retry flaky tests in CI
  trace: 'on-first-retry',               // Auto-capture traces on failure
  screenshot: 'only-on-failure',          // Screenshots on failure
  video: 'retain-on-failure',            // Videos on failure
}
```
