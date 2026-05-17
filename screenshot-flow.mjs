import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const BASE = 'http://localhost:3005'
const OUT  = './screenshots'
mkdirSync(OUT, { recursive: true })

const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true })

async function clickNext(page) {
  const btn = page.locator('button').filter({ hasText: /lanjut|selesai|lihat rencana/i }).first()
  await btn.waitFor({ state: 'visible', timeout: 5000 })
  await btn.click()
  await page.waitForTimeout(500)
}

;(async () => {
  const browser = await chromium.launch({ headless: true })

  // ── DESKTOP FLOW ──────────────────────────────────────────────
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()

  // 1. Landing
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await shot(page, '01-landing-desktop')
  console.log('✓ 1 Landing')

  // 2. Onboarding — start fresh
  await page.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
  await shot(page, '02-onboarding-names')

  // Step 1: Nama
  await page.fill('input[placeholder*="Siti"]', 'Danaa')
  await page.fill('input[placeholder*="Ahmad"]', 'Danii')
  await clickNext(page)
  console.log('✓ Step 1 Nama')

  // Step 2: Kota
  await shot(page, '03-onboarding-city')
  await page.selectOption('select', { label: 'Jakarta' })
  await clickNext(page)
  console.log('✓ Step 2 Kota')

  // Step 3: Tanggal
  await shot(page, '04-onboarding-date')
  await page.fill('input[type="date"]', '2026-12-20')
  await clickNext(page)
  console.log('✓ Step 3 Tanggal')

  // Step 4: Budget — input formatted
  await shot(page, '05-onboarding-budget')
  const budgetInput = page.locator('input[inputmode="numeric"]').first()
  await budgetInput.click()
  await budgetInput.fill('150000000')
  await page.waitForTimeout(300)
  await clickNext(page)
  console.log('✓ Step 4 Budget')

  // Step 5: Tamu
  await shot(page, '06-onboarding-guests')
  const guestInput = page.locator('input[type="number"]').first()
  await guestInput.fill('200')
  await page.waitForTimeout(300)
  await clickNext(page)
  console.log('✓ Step 5 Tamu')

  // Step 6: Style — opsi: Simple, Elegant, Luxury, Traditional, Modern
  await shot(page, '07-onboarding-style')
  await page.locator('button', { hasText: 'Elegant' }).click()
  await page.waitForTimeout(300)
  await clickNext(page)
  console.log('✓ Step 6 Style')

  // Step 7: Event Priority — eventType + planningPriority (dua pilihan)
  await shot(page, '08-onboarding-event')
  await page.locator('button', { hasText: 'Akad + Resepsi' }).click()
  await page.waitForTimeout(200)
  await page.locator('button', { hasText: 'Seimbang' }).click()
  await page.waitForTimeout(200)
  await shot(page, '08b-onboarding-event-selected')
  // Tombol terakhir: "Lihat Hasil →"
  await page.locator('button', { hasText: 'Lihat Hasil' }).click()
  console.log('✓ Step 7 Event Priority')

  // 3. Result
  await page.waitForURL(`${BASE}/result`, { timeout: 8000 }).catch(async () => {
    console.log('  redirect ke result gagal, navigasi manual')
    await page.goto(`${BASE}/result`)
  })
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await shot(page, '09-result-desktop')
  console.log('✓ Result')

  // 4. Premium
  await page.goto(`${BASE}/premium`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await shot(page, '10-premium-desktop')
  console.log('✓ Premium')

  // 5. Dashboard
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await shot(page, '11-dashboard-desktop')
  console.log('✓ Dashboard')

  await ctx.close()

  // ── MOBILE PASS ───────────────────────────────────────────────
  const mob = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
  })
  const mp = await mob.newPage()

  await mp.goto(BASE, { waitUntil: 'networkidle' })
  await mp.screenshot({ path: `${OUT}/m1-landing-mobile.png`, fullPage: true })
  console.log('✓ Mobile - Landing')

  await mp.goto(`${BASE}/result`, { waitUntil: 'networkidle' })
  await mp.waitForTimeout(800)
  await mp.screenshot({ path: `${OUT}/m2-result-mobile.png`, fullPage: true })
  console.log('✓ Mobile - Result')

  await mp.goto(`${BASE}/premium`, { waitUntil: 'networkidle' })
  await mp.waitForTimeout(500)
  await mp.screenshot({ path: `${OUT}/m3-premium-mobile.png`, fullPage: true })
  console.log('✓ Mobile - Premium')

  await mp.goto(`${BASE}/onboarding`, { waitUntil: 'networkidle' })
  await mp.screenshot({ path: `${OUT}/m4-onboarding-mobile.png`, fullPage: true })
  console.log('✓ Mobile - Onboarding')

  await mob.close()
  await browser.close()
  console.log('\nSemua screenshot tersimpan di ./screenshots/')
})()
