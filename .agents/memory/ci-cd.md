# CI/CD & GitHub Actions

## Workflow File
- Single workflow: `.github/workflows/test.yml`
- No separate `deploy-report.yml` — deploy job lives inside `test.yml`

## Reporter Quirk (Critical)
- `merge-reports` requires **blob** format input, NOT html
- `playwright.config.ts` uses conditional reporter:
  - CI: `[['blob'], ['list']]` → produces `.zip` blobs in `blob-report/`
  - Local: `[['html', { open: 'never' }], ['list']]` → produces HTML in `playwright-report/`
- If you use `html` reporter in CI, `merge-reports` fails with "No report files found"

## Merge Reports Setup
- Each browser job uploads `blob-report/` as `blob-report-<browser>`
- `merge-reports` job downloads all with `pattern: blob-report-*` + `merge-multiple: true` into single dir
- Runs `npx playwright merge-reports --reporter=html ./all-blob-reports`
- Output goes to `playwright-report/` which gets uploaded + deployed

## GitHub Pages
- Source: **GitHub Actions** (not branch-based)
- Deploy URL: `https://adamdanu.github.io/saucedemo_playwright/`
- Uses `actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`
- **Gotcha**: Re-running failed deploy jobs creates duplicate `github-pages` artifacts → "Multiple artifacts named github-pages" error. Fix: trigger fresh workflow run instead of re-running.

## Permissions Required
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Trigger
- Automatic: PR open/sync/reopen to `main`
- Manual: `workflow_dispatch` with optional `test_tags` input (e.g. `@critical`)
