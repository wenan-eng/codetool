import { test, expect } from '@playwright/test'
test('json beautify compress', async ({ page }) => {
  await page.goto('http://localhost:3000/json-formatter')
  await page.getByPlaceholder('请输入').fill('{"a":1,"b":[2,3]}')
  await page.getByRole('button', {name:'JSON美化'}).click()
  await expect(page.getByRole('textbox')).toContainText('"a": 1')
  await page.getByRole('button', {name:'JSON压缩'}).click()
  await expect(page.getByRole('textbox')).toHaveValue('{"a":1,"b":[2,3]}')
})
test('adsense present', async ({ page }) => {
  await page.goto('http://localhost:3000/json-formatter')
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(1)
  await expect(page.locator('ins.adsbygoogle')).toHaveCount(3)
})
