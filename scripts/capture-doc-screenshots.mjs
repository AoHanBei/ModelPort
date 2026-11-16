#!/usr/bin/env node

// Render the repository's real UI with documentation-only synthetic API data.
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(resolve(root, 'dashboard/package.json'))
const { chromium } = require('playwright')
const base = new URL(process.argv[2] || 'http://127.0.0.1:33116')
if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) {
  throw new Error('Use a local documentation-only Vite server.')
}
const output = resolve(root, 'docs/assets')
mkdirSync(output, { recursive: true })
const stamp = Date.parse('2026-11-16T09:00:00+08:00')
const scope = { organizationId: 'org_local', projectId: 'prj_default', environmentId: 'env_default' }
const request = {
  ...scope, ledgerId: 'grq_docs_fallback', requestId: 'req_docs_fallback',
  principalId: 'docs-client', clientProtocol: 'openai-chat-completions',
  requestedModel: 'docs-model', requestPath: '/v1/chat/completions',
  trafficClass: 'synthetic', toolUseRequested: false, stream: true,
  state: 'completed', statusCode: 200, terminalReason: 'completed', errorMessage: null,
  inputTokens: 180, outputTokens: 64, cacheWriteTokens: 0, cacheReadTokens: 0,
  costAmountMicrounits: 420, currency: 'USD', billingMode: 'mixed-attempts',
  chargeable: true, latencyMs: 1820, firstByteLatencyMs: 610, toolOutcome: 'none',
  toolRepairAttempted: false, toolRepairRecovered: false, retryCount: 1,
  fallbackFromProvider: 'provider-a', hasIdempotencyKey: true, leaseOwner: 'docs-instance',
  leaseExpiresAtMs: stamp + 300_000, createdAtMs: stamp, updatedAtMs: stamp + 1820,
  completedAtMs: stamp + 1820, attemptCount: 2,
}
const attempts = [
  { ...scope, attemptId: 'att_docs_01', requestLedgerId: request.ledgerId,
    providerId: 'provider-a', resolvedModel: 'docs-model-a', providerProtocol: 'openai-compatible',
    state: 'failed', statusCode: 503, terminalReason: 'upstream-error',
    errorMessage: 'Synthetic recoverable failure', inputTokens: 40, outputTokens: 0,
    cacheWriteTokens: 0, cacheReadTokens: 0, costAmountMicrounits: 60, currency: 'USD',
    billingMode: 'local-estimate', chargeable: true, latencyMs: 220, firstByteLatencyMs: null,
    leaseOwner: 'docs-instance', leaseExpiresAtMs: stamp + 300_000,
    createdAtMs: stamp, updatedAtMs: stamp + 220, completedAtMs: stamp + 220 },
  { ...scope, attemptId: 'att_docs_02', requestLedgerId: request.ledgerId,
    providerId: 'provider-b', resolvedModel: 'docs-model-b', providerProtocol: 'openai-compatible',
    state: 'completed', statusCode: 200, terminalReason: 'completed', errorMessage: null,
    inputTokens: 140, outputTokens: 64, cacheWriteTokens: 0, cacheReadTokens: 0,
    costAmountMicrounits: 360, currency: 'USD', billingMode: 'upstream-returned',
    chargeable: true, latencyMs: 1600, firstByteLatencyMs: 390,
    leaseOwner: 'docs-instance', leaseExpiresAtMs: stamp + 300_000,
    createdAtMs: stamp + 220, updatedAtMs: stamp + 1820, completedAtMs: stamp + 1820 },
]
const requests = [request,
  { ...request, ledgerId: 'grq_docs_completed', requestId: 'req_docs_completed',
    retryCount: 0, fallbackFromProvider: null, attemptCount: 1, stream: false,
    billingMode: 'upstream-returned', costAmountMicrounits: 360,
    createdAtMs: stamp - 60_000, updatedAtMs: stamp - 59_000, completedAtMs: stamp - 59_000 },
  { ...request, ledgerId: 'grq_docs_cancelled', requestId: 'req_docs_cancelled',
    state: 'cancelled', statusCode: 499, terminalReason: 'downstream-cancelled',
    retryCount: 0, fallbackFromProvider: null, attemptCount: 1,
    billingMode: 'local-estimate', costAmountMicrounits: 220,
    createdAtMs: stamp - 120_000, updatedAtMs: stamp - 119_000, completedAtMs: stamp - 119_000 },
]
const overview = {
  backend: 'postgres', location: 'documentation-fixture', leaseTtlSecs: 300,
  reconcileIntervalSecs: 60, totalRequests: 3, startedRequests: 0, completedRequests: 2,
  failedRequests: 0, cancelledRequests: 1, unreconciledRequests: 0, idempotentRequests: 3,
  activeLeases: 0, expiredLeases: 0, chargeableRequests: 3, totalCostMicrounits: 1000,
  organizationCount: 1, projectCount: 1, environmentCount: 1,
}
const budget = {
  account: { ...scope, currency: 'USD', limitMicrounits: 1_000_000,
    reservedMicrounits: 0, settledMicrounits: 1000, availableMicrounits: 999_000,
    utilizationBasisPoints: 10, version: 3, updatedAtMs: stamp + 1820 }, recentEvents: [],
}
const user = { id: 'usr_docs', username: 'docs-admin', email: 'docs@example.invalid',
  role: 'admin', status: 'active', createdAt: '2026-11-16T01:00:00Z', lastLoginAt: null,
  apiKeyCount: 0, requestCount24h: 3 }
const responses = new Map([
  ['/admin/auth/me', user],
  ['/admin/auth/methods', { passwordEnabled: true, oidc: { enabled: false, label: 'OIDC', startUrl: '' } }],
  ['/admin/enterprise/overview', overview],
  ['/admin/enterprise/budget', budget],
  ['/admin/enterprise/requests', { requests, total: requests.length, page: 1, pageSize: 20 }],
  [`/admin/enterprise/requests/${request.ledgerId}`, { request, attempts }],
  ['/livez', { status: 'ok' }],
])
const browser = await chromium.launch({
  headless: true, args: ['--no-proxy-server'],
  ...(process.env.MODELPORT_SCREENSHOT_BROWSER ? { executablePath: process.env.MODELPORT_SCREENSHOT_BROWSER } : {}),
})
try {
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1, colorScheme: 'light', locale: 'zh-CN', timezoneId: 'Asia/Shanghai' })
  const unhandled = []
  let authenticated = false
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url())
    if (url.origin !== base.origin) return route.abort()
    if (url.pathname === '/admin/auth/me' && !authenticated) {
      return route.fulfill({ status: 401, contentType: 'application/json', body: '{"message":"Documentation sign-in required"}' })
    }
    if (url.pathname === '/admin/auth/login' && route.request().method() === 'POST') {
      authenticated = true
      return route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ user, expiresAt: '2026-11-17T01:00:00Z' }) })
    }
    const body = responses.get(url.pathname)
    if (body !== undefined && route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
    }
    if (url.pathname.startsWith('/admin/') || url.pathname === '/livez') {
      unhandled.push(`${route.request().method()} ${url.pathname}`)
      return route.fulfill({ status: 500, contentType: 'application/json', body: '{"message":"Missing documentation fixture"}' })
    }
    return route.continue()
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.setDefaultTimeout(15_000)
  await page.clock.setFixedTime(stamp + 60_000)
  await page.goto(new URL('/login', base).href)
  await page.waitForLoadState('networkidle')
  await page.getByLabel('用户名', { exact: true }).fill('docs-admin')
  await page.getByLabel('密码', { exact: true }).fill('documentation-only')
  await page.getByRole('button', { name: '登录', exact: true }).click()
  await page.getByRole('link', { name: '企业运行', exact: true }).click()
  await page.getByRole('button', { name: 'grq_docs_fallback', exact: false }).waitFor()
  await page.getByText('网关进程在线', { exact: true }).waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' })
  await page.evaluate(() => {
    const label = document.createElement('span')
    label.textContent = '文档示例 · 合成 API 数据 / SYNTHETIC DATA'
    label.style.cssText = 'margin-left:20px;padding:5px 10px;background:#fff5da;color:#805000;border:1px solid #dfc581;border-radius:4px;font-size:12px;white-space:nowrap'
    document.querySelector('header > div')?.append(label)
  })
  await page.screenshot({ path: resolve(output, 'request-ledger.png') })
  await page.setViewportSize({ width: 1600, height: 2100 })
  await page.getByRole('button', { name: 'grq_docs_fallback', exact: false }).click()
  const dialog = page.getByRole('dialog', { name: '请求事实' })
  await dialog.getByText('Provider Attempts · 2', { exact: true }).waitFor()
  await dialog.getByText('Synthetic recoverable failure', { exact: false }).waitFor()
  await dialog.evaluate((element) => {
    const label = document.createElement('p')
    label.textContent = '文档示例 · 合成 API 数据 / SYNTHETIC DATA'
    label.style.cssText = 'background:#fff5da;color:#805000;padding:10px 24px;font-size:12px'
    element.prepend(label)
  })
  const detailBounds = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const lastSection = element.querySelector('section:last-of-type')
    return { x: rect.x, y: rect.y, width: rect.width,
      height: Math.ceil((lastSection?.getBoundingClientRect().bottom ?? rect.bottom) - rect.y) }
  })
  await page.screenshot({ path: resolve(output, 'request-detail.png'), clip: detailBounds })
  if (unhandled.length || errors.length) throw new Error(JSON.stringify({ unhandled, errors }))
  writeFileSync(resolve(output, 'screenshots.json'), JSON.stringify({
    sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    source: 'dashboard/src/pages/EnterprisePage.tsx', fixture: 'scripts/capture-doc-screenshots.mjs',
    dataKind: 'synthetic-api-fixture', fixtureTime: '2026-11-16T09:00:00+08:00',
    browser: browser.version(), files: ['request-ledger.png', 'request-detail.png'],
  }, null, 2) + '\n')
  console.log('Captured dashboard documentation images; no unhandled API requests or page errors.')
} finally {
  await browser.close()
}
