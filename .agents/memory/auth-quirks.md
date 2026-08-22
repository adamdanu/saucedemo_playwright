# Memory: Authentication & Login Quirks

## Credentials & Environment
- Store all credentials in `.env` via `process.env`.
- Base URL: `https://www.saucedemo.com`.

## Known Behaviors & Edge Cases
- **Locked Out User**: Error banner text: `"Epic sadface: Sorry, this user has been locked out."`
- **Invalid Credentials**: Error text: `"Epic sadface: Username and password do not match any user in this service"`
- **Empty Username / Password**: Error text: `"Epic sadface: Username is required"` / `"Epic sadface: Password is required"`
## Session State Management
- **Pre-authenticated Session**: `tests/setup/auth.setup.ts` saves state to `playwright/.auth/user.json`.
- **Default for Tests**: All browser projects automatically inherit saved session (already logged in).
- **Reset for Login Tests**: Add `test.use({ storageState: { cookies: [], origins: [] } });` to test unauthenticated flows.
