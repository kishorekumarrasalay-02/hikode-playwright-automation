import { test, expect } from '../src/fixtures/test-base';
import { SignInPage } from './login.page';
import { LOGIN_CREDENTIALS } from './login-credentials';

test.describe('HiKode sign in', () => {
  test('user can sign in with valid credentials', async ({ page }) => {
    const signInPage = new SignInPage(page);

    console.log('Signing in with:', LOGIN_CREDENTIALS.email);

    await signInPage.goto();
    await signInPage.signIn(LOGIN_CREDENTIALS.email, LOGIN_CREDENTIALS.password);

    await expect(page).not.toHaveURL(/\/login$/, { timeout: 20_000 });
    console.log('Sign in successful. Current URL:', page.url());
  });
});
