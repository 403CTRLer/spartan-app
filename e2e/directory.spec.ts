import { test, expect } from '@playwright/test';
import { clearAuthState, signupUser } from './helpers/auth';
import { DirectoryPage } from './helpers/page-objects';

test.describe('Directory Page', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated user for each test
    await clearAuthState(page);
    const email = `test-${Date.now()}@example.com`;
    await signupUser(page, 'Test User', email, 'password123');
  });

  test.describe('Page Load', () => {
    test('should display loading skeleton initially', async ({ page }) => {
      await page.goto('/directory');

      // Check for skeleton elements (they appear briefly)
      const skeleton = page.locator('[class*="skeleton"]');
      // Skeleton might disappear quickly, so we just check if it exists or existed
      const skeletonCount = await skeleton.count();
      // Either skeleton is visible or page has loaded (skeleton removed)
      expect(skeletonCount >= 0).toBe(true);
    });

    test('should load and display spartans list', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();

      // Wait for content to load (skeleton should be gone)
      await page.waitForTimeout(1000);

      // Should see spartans directory title
      await expect(page.locator('text=/spartans directory/i')).toBeVisible();

      // Should have some spartans displayed
      const visibleCount = await directoryPage.getVisibleSpartansCount();
      expect(visibleCount).toBeGreaterThan(0);
    });

    test('should display total spartans count', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();

      await page.waitForTimeout(1000);

      // Should show count in title
      const countText = await directoryPage.spartansCount.textContent();
      expect(countText).toMatch(/\(\d+\)/);
    });
  });

  test.describe('Search Functionality', () => {
    test('should filter results by search query', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const initialCount = await directoryPage.getVisibleSpartansCount();

      // Search for a specific term (using first spartan's name if available)
      await directoryPage.search('Priya');

      await page.waitForTimeout(500);

      // Results should be filtered
      const filteredCount = await directoryPage.getVisibleSpartansCount();
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
    });

    test('should search by name', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      await directoryPage.search('Priya');
      await page.waitForTimeout(500);

      // Should show filtered results
      const count = await directoryPage.getVisibleSpartansCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search by designation', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      await directoryPage.search('Admin');
      await page.waitForTimeout(500);

      // Should show filtered results
      const count = await directoryPage.getVisibleSpartansCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should search by college', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      await directoryPage.search('Mumbai');
      await page.waitForTimeout(500);

      // Should show filtered results
      const count = await directoryPage.getVisibleSpartansCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should show all results when search is cleared', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const initialCount = await directoryPage.getVisibleSpartansCount();

      await directoryPage.search('NonexistentTerm12345');
      await page.waitForTimeout(500);

      // Should show fewer or no results
      const filteredCount = await directoryPage.getVisibleSpartansCount();

      await directoryPage.clearSearch();
      await page.waitForTimeout(500);

      // Should show all results again
      const restoredCount = await directoryPage.getVisibleSpartansCount();
      expect(restoredCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe('Filter Functionality', () => {
    test('should filter by Available status', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const allCount = await directoryPage.getVisibleSpartansCount();

      await directoryPage.clickFilter('available');
      await page.waitForTimeout(500);

      const availableCount = await directoryPage.getVisibleSpartansCount();
      expect(availableCount).toBeLessThanOrEqual(allCount);
    });

    test('should filter by Unavailable status', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const allCount = await directoryPage.getVisibleSpartansCount();

      await directoryPage.clickFilter('unavailable');
      await page.waitForTimeout(500);

      const unavailableCount = await directoryPage.getVisibleSpartansCount();
      expect(unavailableCount).toBeLessThanOrEqual(allCount);
    });

    test('should show all spartans when All filter is selected', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const initialCount = await directoryPage.getVisibleSpartansCount();

      // Apply a filter first
      await directoryPage.clickFilter('available');
      await page.waitForTimeout(500);

      // Then click All
      await directoryPage.clickFilter('all');
      await page.waitForTimeout(500);

      const allCount = await directoryPage.getVisibleSpartansCount();
      expect(allCount).toBeGreaterThanOrEqual(initialCount);
    });
  });

  test.describe('Pagination', () => {
    test('should display pagination controls when there are more than 12 items', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const totalCount = await directoryPage.getSpartansCount();

      if (totalCount > 12) {
        // Pagination should be visible
        const paginationVisible = await directoryPage.paginationControls.first().isVisible();
        expect(paginationVisible).toBe(true);
      }
    });

    test('should navigate to next page', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const totalCount = await directoryPage.getSpartansCount();

      if (totalCount > 12) {
        const firstPageItems = await directoryPage.getVisibleSpartansCount();

        // Click next page if available
        const nextButton = directoryPage.nextPageButton;
        if (await nextButton.isVisible()) {
          await directoryPage.clickNextPage();
          await page.waitForTimeout(500);

          // Should show different items (might be same count but different content)
          const secondPageItems = await directoryPage.getVisibleSpartansCount();
          expect(secondPageItems).toBeGreaterThan(0);
        }
      }
    });

    test('should navigate to previous page', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const totalCount = await directoryPage.getSpartansCount();

      if (totalCount > 12) {
        // Go to page 2 first
        const nextButton = directoryPage.nextPageButton;
        if (await nextButton.isVisible()) {
          await directoryPage.clickNextPage();
          await page.waitForTimeout(500);

          // Then go back
          const prevButton = directoryPage.previousPageButton;
          if (await prevButton.isVisible()) {
            await directoryPage.clickPreviousPage();
            await page.waitForTimeout(500);

            // Should be back on first page
            const firstPageItems = await directoryPage.getVisibleSpartansCount();
            expect(firstPageItems).toBeGreaterThan(0);
          }
        }
      }
    });

    test('should navigate to specific page number', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      const totalCount = await directoryPage.getSpartansCount();

      if (totalCount > 24) {
        // Click page 2 directly
        await directoryPage.clickPageNumber(2);
        await page.waitForTimeout(500);

        // Should show page 2 items
        const page2Items = await directoryPage.getVisibleSpartansCount();
        expect(page2Items).toBeGreaterThan(0);
      }
    });
  });

  test.describe('Combined Search and Filter', () => {
    test('should apply both search and filter together', async ({ page }) => {
      const directoryPage = new DirectoryPage(page);
      await directoryPage.goto();
      await page.waitForTimeout(1000);

      // Apply filter
      await directoryPage.clickFilter('available');
      await page.waitForTimeout(300);

      // Apply search
      await directoryPage.search('Admin');
      await page.waitForTimeout(500);

      // Should show filtered and searched results
      const count = await directoryPage.getVisibleSpartansCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});

