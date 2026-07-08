import { test } from '../src/fixtures/test-base';
import { SignupFlow } from '../src/flows/signup.flow';
import {
  generateIndividualSignupData,
  generateOrganizationSignupData,
} from '../src/utils/test-data';

test.describe('HiKode signup flow with email verification', () => {
  test('individual user can sign up and verify email', async ({ page }) => {
    const signupUser = generateIndividualSignupData();
    const signupFlow = new SignupFlow(page);

    await signupFlow.completeIndividualSignupWithEmailVerification(signupUser);
  });

  test('organization user can sign up and verify email', async ({ page }) => {
    const signupUser = generateOrganizationSignupData();
    const signupFlow = new SignupFlow(page);

    await signupFlow.completeOrganizationSignupWithEmailVerification(signupUser);
  });
});
