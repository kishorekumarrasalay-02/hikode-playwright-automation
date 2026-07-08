import { type Page, type Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly profileAvatar: Locator;
  readonly profileMenuLink: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly skillInput: Locator;
  readonly addSkillButton: Locator;
  readonly saveChangesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.profileAvatar = page.locator('img.profile-avatar.shadow-sm').first();
    this.profileMenuLink = page.getByRole('link', { name: 'Profile', exact: true });
    this.firstNameInput = page.locator('[formcontrolname="firstName"]');
    this.lastNameInput = page.locator('[formcontrolname="lastName"]');
    this.skillInput = page.getByPlaceholder('Type a skill');
    this.addSkillButton = page.getByRole('button', { name: 'Add', exact: true });
    this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
  }

  async openFromProfileLogo(): Promise<void> {
    await this.profileAvatar.click();
    await this.profileMenuLink.click();
    await expect(this.page).toHaveURL(/\/profile/, { timeout: 15_000 });
    await expect(this.page.getByText(/(My|Our) Profile/).first()).toBeVisible();
    console.log('Opened profile page:', this.page.url());
  }

  async updateName(firstName: string, lastName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    console.log('Updated name:', firstName, lastName);
  }

  async openAddSkillsSection(): Promise<void> {
    const skillsLabel = this.page.getByText(/^(My|Our) (Skills|Expertise)$/).first();
    await skillsLabel.scrollIntoViewIfNeeded();
    await this.skillInput.click();
    console.log('Opened skills section to add skills.');
  }

  async addSkill(skill: string): Promise<void> {
    const existingSkill = this.page.locator('.d-flex.flex-wrap.gap-2').getByText(skill, { exact: true });
    if (await existingSkill.isVisible().catch(() => false)) {
      console.log(`Skill already added: ${skill}`);
      return;
    }

    await this.openAddSkillsSection();
    await this.skillInput.fill(skill);
    await this.addSkillButton.click();
    await expect(this.page.locator('.d-flex.flex-wrap.gap-2').getByText(skill, { exact: true })).toBeVisible();
    console.log(`Added skill: ${skill}`);
  }

  async addSkills(skills: readonly string[]): Promise<void> {
    await this.openAddSkillsSection();

    for (const skill of skills) {
      await this.addSkill(skill);
    }
  }

  async saveChanges(): Promise<void> {
    await this.saveChangesButton.scrollIntoViewIfNeeded();
    await this.saveChangesButton.click();
    await this.dismissSuccessPopup();
    console.log('Clicked Save Changes.');
  }

  async dismissSuccessPopup(): Promise<void> {
    const successDialog = this.page.getByRole('dialog', { name: 'success message' });
    const isVisible = await successDialog
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (isVisible) {
      await expect(successDialog).toContainText(/updated successfully/i);
      await successDialog.getByRole('button', { name: 'Close' }).click();
      await expect(successDialog).toBeHidden({ timeout: 10_000 });
      console.log('Dismissed success popup using X button.');
    }
  }

  async goToDashboard(): Promise<void> {
    await this.page.getByRole('navigation').getByRole('link', { name: 'Dashboard', exact: true }).click();
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
    console.log('Returned to dashboard:', this.page.url());
  }
}
