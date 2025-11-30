import { Page, Locator } from '@playwright/test';

/**
 * Page Object Models for E2E tests
 * Provides reusable selectors and actions for each page
 */

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly signupLink: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly generalError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]').first();
    this.submitButton = page.locator('button[type="submit"]');
    this.signupLink = page.locator('a[href="/signup"]');
    this.emailError = page.locator('text=/email/i').filter({ hasText: /required|valid/i });
    this.passwordError = page.locator('text=/password/i').filter({ hasText: /required|characters/i });
    this.generalError = page.locator('text=/invalid|error/i');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }
}

export class SignupPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('input[placeholder="John Doe"]');
    this.emailInput = page.locator('input[type="email"]');
    const passwordInputs = page.locator('input[type="password"]');
    this.passwordInput = passwordInputs.first();
    this.confirmPasswordInput = passwordInputs.last();
    this.submitButton = page.locator('button[type="submit"]');
    this.loginLink = page.locator('a[href="/login"]');
  }

  async goto() {
    await this.page.goto('/signup');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password: string) {
    await this.confirmPasswordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async signup(name: string, email: string, password: string) {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(password);
    await this.submit();
  }
}

export class DirectoryPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly allFilterChip: Locator;
  readonly availableFilterChip: Locator;
  readonly unavailableFilterChip: Locator;
  readonly spartansCount: Locator;
  readonly spartansList: Locator;
  readonly paginationControls: Locator;
  readonly nextPageButton: Locator;
  readonly previousPageButton: Locator;
  readonly loadingSkeleton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.allFilterChip = page.locator('button').filter({ hasText: /^All$/ });
    this.availableFilterChip = page.locator('button').filter({ hasText: /^Available$/ });
    this.unavailableFilterChip = page.locator('button').filter({ hasText: /^Unavailable$/ });
    this.spartansCount = page.locator('text=/spartans directory/i');
    // Spartans can be in table rows (desktop) or grid cards (mobile)
    this.spartansList = page.locator('table tbody tr, [class*="grid"] > div').filter({ hasText: /admin|city lead|media coordinator|campus admin/i });
    // Pagination chips are buttons with page numbers
    this.paginationControls = page.locator('button').filter({ hasText: /^\d+$/ });
    this.nextPageButton = page.locator('button').filter({ hasText: /^Next$/ });
    this.previousPageButton = page.locator('button').filter({ hasText: /^Previous$/ });
    this.loadingSkeleton = page.locator('[class*="skeleton"], [class*="animate-pulse"]');
  }

  async goto() {
    await this.page.goto('/directory');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Wait for search to process
    await this.page.waitForTimeout(300);
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.waitForTimeout(300);
  }

  async clickFilter(filter: 'all' | 'available' | 'unavailable') {
    switch (filter) {
      case 'all':
        await this.allFilterChip.click();
        break;
      case 'available':
        await this.availableFilterChip.click();
        break;
      case 'unavailable':
        await this.unavailableFilterChip.click();
        break;
    }
    await this.page.waitForTimeout(300);
  }

  async getSpartansCount(): Promise<number> {
    // Try to get count from the title or count display
    const countText = await this.spartansCount.textContent();
    const match = countText?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async getVisibleSpartansCount(): Promise<number> {
    // Count visible rows/cards - try both desktop table and mobile grid
    const tableRows = this.page.locator('table tbody tr');
    const gridCards = this.page.locator('[class*="grid"] > div');
    
    const tableCount = await tableRows.count();
    const gridCount = await gridCards.count();
    
    // Return whichever is visible (one will be 0, the other will have count)
    return Math.max(tableCount, gridCount);
  }

  async clickPageNumber(pageNum: number) {
    await this.paginationControls.filter({ hasText: String(pageNum) }).click();
    await this.page.waitForTimeout(300);
  }

  async clickNextPage() {
    await this.nextPageButton.click();
    await this.page.waitForTimeout(300);
  }

  async clickPreviousPage() {
    await this.previousPageButton.click();
    await this.page.waitForTimeout(300);
  }
}

