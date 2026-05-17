import { chromium } from 'playwright'

const BASE = 'http://localhost:3005'
const OUT  = './screenshots'

;(async () => {
  const browser = await chromium.launch({ headless: true })

  // Desktop dashboard
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  await page.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' })
  await page.fill('input[type="email"], input[placeholder*="email" i], input[placeholder*="Email"]', 'farhanafgany@gmail.com')
  await page.fill('input[type="password"]', 'Qwerty12')
  await page.click('button[type="submit"], button:has-text("Masuk")')

  // Tunggu redirect ke dashboard
  await page.waitForURL(`${BASE}/dashboard`, { timeout: 15000 }).catch(async () => {
    console.log('  menunggu redirect...')
    await page.waitForTimeout(3000)
    await page.goto(`${BASE}/dashboard`)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/12-dashboard-loggedin-desktop.png`, fullPage: true })
  console.log('✓ Dashboard desktop (logged in)')

  await ctx.close()

  // Mobile dashboard
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
  })
  const mp = await mob.newPage()

  await mp.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle' })
  await mp.fill('input[type="email"], input[placeholder*="email" i], input[placeholder*="Email"]', 'farhanafgany@gmail.com')
  await mp.fill('input[type="password"]', 'Qwerty12')
  await mp.click('button[type="submit"], button:has-text("Masuk")')

  await mp.waitForURL(`${BASE}/dashboard`, { timeout: 15000 }).catch(async () => {
    await mp.waitForTimeout(3000)
    await mp.goto(`${BASE}/dashboard`)
  })
  await mp.waitForLoadState('networkidle')
  await mp.waitForTimeout(1500)
  await mp.screenshot({ path: `${OUT}/m5-dashboard-loggedin-mobile.png`, fullPage: true })
  console.log('✓ Dashboard mobile (logged in)')

  await browser.close()
})()
