import { test, expect } from '@playwright/test';
import { clearAuthState, signupUser, isAuthenticated } from './helpers/auth';
import { LoginPage, SignupPage } from './helpers/page-objects';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state before each test for isolation
    await clearAuthState(page);
  });

  test.describe('Login Flow', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      // First, create a user via signup
      const email = `test-${Date.now()}@example.com`;
      const password = 'password123';
      await signupUser(page, 'Test User', email, password);

      // Clear auth and login
      await clearAuthState(page);
      await page.goto('/login');

      const loginPage = new LoginPage(page);
      await loginPage.login(email, password);

      // Verify redirect to directory
      await expect(page).toHaveURL('/directory');
      // Verify user is authenticated
      expect(await isAuthenticated(page)).toBe(true);
    });

    test('should show error for empty email', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.fillPassword('password123');
      await loginPage.submit();

      // Should show email error
      await expect(loginPage.emailInput).toBeFocused();
      // Form should not submit (still on login page)
      await expect(page).toHaveURL('/login');
    });

    test('should show error for invalid email format', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.fillEmail('invalid-email');
      await loginPage.fillPassword('password123');
      await loginPage.submit();

      // Should show email validation error
      const errorText = await page.textContent('body');
      expect(errorText).toContain('valid email');
      await expect(page).toHaveURL('/login');
    });

    test('should show error for short password', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.fillEmail('test@example.com');
      await loginPage.fillPassword('12345'); // Less than 6 characters
      await loginPage.submit();

      // Should show password error
      const errorText = await page.textContent('body');
      expect(errorText).toContain('6 characters');
      await expect(page).toHaveURL('/login');
    });

    test('should show error for invalid credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('nonexistent@example.com', 'wrongpassword');

      // Should show general error message
      const errorText = await page.textContent('body');
      expect(errorText).toMatch(/invalid|error/i);
      await expect(page).toHaveURL('/login');
    });
  });

  test.describe('Signup Flow', () => {
    test('should successfully signup with valid data', async ({ page }) => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'password123';

      const signupPage = new SignupPage(page);
      await signupPage.goto();
      await signupPage.signup('Test User', email, password);

      // Verify redirect to directory
      await expect(page).toHaveURL('/directory');
      // Verify user is authenticated
      expect(await isAuthenticated(page)).toBe(true);
    });

    test('should show error for empty name', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.goto();
      await signupPage.fillEmail('test@example.com');
      await signupPage.fillPassword('password123');
      await signupPage.fillConfirmPassword('password123');
      await signupPage.submit();

      // Should show name error
      const errorText = await page.textContent('body');
      expect(errorText).toContain('Name');
      await expect(page).toHaveURL('/signup');
    });

    test('should show error for password mismatch', async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.goto();
      await signupPage.fillName('Test User');
      await signupPage.fillEmail('test@example.com');
      await signupPage.fillPassword('password123');
      await signupPage.fillConfirmPassword('different123');
      await signupPage.submit();

      // Should show password mismatch error
      const errorText = await page.textContent('body');
      expect(errorText).toMatch(/match|confirm/i);
      await expect(page).toHaveURL('/signup');
    });

    test('should show error for duplicate email', async ({ page }) => {
      const email = `test-${Date.now()}@example.com`;
      const password = 'password123';

      // Create first user
      await signupUser(page, 'First User', email, password);
      await clearAuthState(page);

      // Try to signup with same email
      const signupPage = new SignupPage(page);
      await signupPage.goto();
      await signupPage.signup('Second User', email, password);

      // Should show duplicate email error
      const errorText = await page.textContent('body');
      expect(errorText).toMatch(/already exists|duplicate/i);
      await expect(page).toHaveURL('/signup');
    });
  });

  test.describe('Route Protection', () => {
    test('should redirect unauthenticated user from /directory to /login', async ({ page }) => {
      await clearAuthState(page);
      await page.goto('/directory');

      // Should redirect to login
      await expect(page).toHaveURL('/login');
    });

    test('should redirect authenticated user from /login to /directory', async ({ page }) => {
      // Create and login user
      const email = `test-${Date.now()}@example.com`;
      await signupUser(page, 'Test User', email, 'password123');

      // Try to access login page
      await page.goto('/login');

      // Should redirect to directory
      await expect(page).toHaveURL('/directory');
    });

    test('should redirect authenticated user from /signup to /directory', async ({ page }) => {
      // Create and login user
      const email = `test-${Date.now()}@example.com`;
      await signupUser(page, 'Test User', email, 'password123');

      // Try to access signup page
      await page.goto('/signup');

      // Should redirect to directory
      await expect(page).toHaveURL('/directory');
    });
  });
});

