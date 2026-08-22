# Memory: User & Team Preferences

## Architecture & Test Rules
- **1 Test Case Per File**: Every `.spec.ts` file holds exactly 1 test case. (Enforced: 2026-08-22).
- **Mandatory Outcome Verification**: Never stop at user interaction. Always verify end destination URL, badge counters, or landing UI state. (Enforced: 2026-08-22).
- **TypeScript & POM**: Strict Page Object Model with TypeScript. Tests own web-first `expect(pageObject.locator)` assertions.
- **Locator Strategy**: Prioritize `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`. Zero XPath / fragile CSS.
- **No Hard Waits**: `page.waitForTimeout()` strictly prohibited.
- **Environment & Secrets**: Secrets in `.env` (gitignored), template in `.env.example`.
