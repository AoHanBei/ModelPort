# Documentation Assets

## Request Diagram

`modelport-overview.svg` is a source-controlled vector diagram of request
execution and ledger relationships. Its two-attempt example is illustrative;
dashed connectors represent related records, not an additional execution order.
Edit the SVG directly when the runtime contracts change.

## Dashboard Screenshots

`request-ledger.png` and `request-detail.png` show the actual React dashboard
from this repository's `EnterprisePage.tsx`. The capture script intercepts local
API responses, including a synthetic sign-in, blocks external requests, and labels the
images **SYNTHETIC DATA**. It does not start the backend, use real credentials,
or call a Provider. The figures demonstrate the UI, not a backend test result.

`screenshots.json` records the source revision, fixture, and capture browser.
Amounts, states, model names, Provider names, and timestamps are examples.

### Reproduce

Install dashboard dependencies with `npm ci` inside `dashboard/`. Install the
matching browser with `npx playwright install chromium` if needed. Then start
the Vite development server with mock mode disabled:

```bash
cd dashboard
VITE_MODELPORT_MOCK=0 npm run dev -- --host 127.0.0.1 --port 33116 --strictPort
```

From another terminal in the repository root:

```bash
node scripts/capture-doc-screenshots.mjs http://127.0.0.1:33116
```

To use an installed browser instead of Playwright's downloaded Chromium, set
`MODELPORT_SCREENSHOT_BROWSER` to its executable path. The script uses a fresh
browser context and accepts only a loopback server URL. Stop Vite after capture.
