import { test, expect } from '@playwright/test'

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:5173')
  })

  test('loads page with default results', async ({ page }) => {
    // Wait for the results table to be visible
    await expect(page.locator('table')).toBeVisible()

    // Check that results are displayed
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(10)
  })

  test('displays suggestions when typing in search bar', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search files..."]')

    // Type a query
    await searchInput.fill('project')

    // Wait for suggestions to appear
    await page.waitForTimeout(500) // Wait for debounce

    // Check if suggestions dropdown is visible
    const suggestionsDropdown = page.locator('[class*="absolute"][class*="z-10"]')
    await expect(suggestionsDropdown).toBeVisible()
  })

  test('searches when Enter key is pressed', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search files..."]')

    // Type a query and press Enter
    await searchInput.fill('report')
    await searchInput.press('Enter')

    // Wait for results to update
    await page.waitForTimeout(500)

    // Check that table is still visible with results
    await expect(page.locator('table')).toBeVisible()
  })

  test('searches when Search button is clicked', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search files..."]')
    const searchButton = page.locator('button:has-text("Search")')

    // Type a query and click Search
    await searchInput.fill('document')
    await searchButton.click()

    // Wait for results to update
    await page.waitForTimeout(500)

    // Check that table is still visible with results
    await expect(page.locator('table')).toBeVisible()
  })

  test('filters by category', async ({ page }) => {
    // Click on a category checkbox
    const documentCheckbox = page.locator('input[type="checkbox"]').first()
    await documentCheckbox.check()

    // Wait for results to update
    await page.waitForTimeout(500)

    // Check that table is still visible
    await expect(page.locator('table')).toBeVisible()
  })

  test('sorts table by clicking column header', async ({ page }) => {
    // Click on Title column header
    const titleHeader = page.locator('th:has-text("Title")')
    await titleHeader.click()

    // Wait for results to update
    await page.waitForTimeout(500)

    // Check that table is still visible
    await expect(page.locator('table')).toBeVisible()

    // Check for sort indicator
    const sortIndicator = titleHeader.locator('span')
    await expect(sortIndicator).toBeVisible()
  })

  test('navigates between pages', async ({ page }) => {
    // Wait for pagination to be visible
    const nextButton = page.locator('button:has-text("Next")')
    await expect(nextButton).toBeVisible()

    // Click Next
    await nextButton.click()

    // Wait for results to update
    await page.waitForTimeout(500)

    // Check that we're on page 2
    const page2Button = page.locator('button.bg-blue-600:has-text("2")')
    await expect(page2Button).toBeVisible()
  })

  test('opens login modal', async ({ page }) => {
    // Click Login button
    const loginButton = page.locator('button:has-text("Login")')
    await loginButton.click()

    // Check that modal is visible
    const modal = page.locator('h3:has-text("Login to SpringFileKeeper")')
    await expect(modal).toBeVisible()
  })
})
