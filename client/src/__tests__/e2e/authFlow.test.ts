import { test, expect, Page } from '@playwright/test';

test.describe('Authentication Flow', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    // Create a new page for each test
    page = await browser.newPage();
    
    // Navigate to the login page
    await page.goto('http://localhost:4000/login');
  });

  test.afterEach(async () => {
    // Close the page after each test
    await page.close();
  });

  test('should display login form', async () => {
    // Check if login form elements are visible
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for empty fields', async () => {
    // Click sign in without entering any data
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check for validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async () => {
    // Enter invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill('password123');
    
    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check for validation error
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('should show error message for invalid credentials', async () => {
    // Enter valid email format but incorrect credentials
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    
    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check for error message
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should login successfully and redirect to dashboard', async () => {
    // Enter valid credentials (these should match test user in your system)
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    
    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Check that we're redirected to the dashboard
    await expect(page).toHaveURL('http://localhost:4000/dashboard');
    
    // Check that user info is displayed
    await expect(page.getByText('Welcome')).toBeVisible();
    
    // Check that logout button is available
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  test('should logout successfully', async () => {
    // First login
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for dashboard to load
    await expect(page).toHaveURL('http://localhost:4000/dashboard');
    
    // Click logout
    await page.getByRole('button', { name: 'Logout' }).click();
    
    // Check that we're redirected to login page
    await expect(page).toHaveURL('http://localhost:4000/login');
    
    // Try to access a protected route
    await page.goto('http://localhost:4000/dashboard');
    
    // Check that we're redirected back to login
    await expect(page).toHaveURL('http://localhost:4000/login');
  });
}); 