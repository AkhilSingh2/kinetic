import { expect, test } from '@playwright/test'

test.describe('with reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
  })

  test('product hero is readable without the intro', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/disappears/i)
    await expect(page.getByRole('progressbar')).toHaveCount(0)
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible()
  })

  test('routes move between product, specs, gallery, and story', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Specs' }).click()
    await expect(page).toHaveURL('/specs')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/measured/i)

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Gallery' }).click()
    await expect(page).toHaveURL('/gallery')
    await expect(page.locator('.gallery-grid img')).toHaveCount(6)

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Story' }).click()
    await expect(page).toHaveURL('/story')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/tool/i)
  })

  test('mobile menu reaches the story', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Story' }).click()
    await expect(page).toHaveURL('/story')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('reserve dialog tells the truth', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Request a pair' }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toContainText(/not a product/i)
    await dialog.getByRole('button', { name: 'Close' }).click()
    await expect(dialog).toBeHidden()
  })

  test('unknown routes have a way home', async ({ page }) => {
    await page.goto('/missing-frequency')
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/empty/i)
    await page.getByRole('link', { name: 'Back to Lyra' }).click()
    await expect(page).toHaveURL('/')
  })
})

test('preloader covers the first view when motion is allowed', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/', { waitUntil: 'commit' })
  await expect(page.getByRole('progressbar', { name: 'Loading Lyra' })).toBeVisible()
})
