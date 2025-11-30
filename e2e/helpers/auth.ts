import { Page } from '@playwright/test';

/**
 * Helper functions for authentication flows in E2E tests
 */

const STORAGE_KEYS = {
  USER: 'spartan_user',
  TOKEN: 'spartan_token',
  USERS_DB: 'spartan_users_db',
};

/**
 * Clear all authentication state from localStorage
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USERS_DB);
  });
}

/**
 * Login as a user by filling the login form
 */
export async function loginAsUser(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  // Wait for navigation to directory page
  await page.waitForURL('/directory', { timeout: 5000 });
}

/**
 * Signup a new user by filling the signup form
 */
export async function signupUser(
  page: Page,
  name: string,
  email: string,
  password: string
): Promise<void> {
  await page.goto('/signup');
  
  // Fill name field
  await page.fill('input[placeholder="John Doe"]', name);
  
  // Fill email field
  await page.fill('input[type="email"]', email);
  
  // Fill password fields - there are two password inputs
  const passwordInputs = page.locator('input[type="password"]');
  await passwordInputs.first().fill(password);
  await passwordInputs.last().fill(password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to directory page
  await page.waitForURL('/directory', { timeout: 5000 });
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
  // Find and click logout button (usually in header/topbar)
  const logoutButton = page.locator('button').filter({ hasText: /logout/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  } else {
    // Fallback: clear auth state directly
    await clearAuthState(page);
    await page.reload();
  }
}

/**
 * Check if user is authenticated by checking localStorage
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return !!localStorage.getItem(STORAGE_KEYS.USER);
  });
}

