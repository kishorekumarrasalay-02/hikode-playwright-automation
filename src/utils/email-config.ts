export interface EmailCredentials {
  webmailUrl: string;
  password: string;
}

export function getEmailCredentials(): EmailCredentials {
  const password = process.env.EMAIL_PASSWORD;

  if (!password) {
    throw new Error(
      'EMAIL_PASSWORD is required for mail verification. Add it to your .env file.',
    );
  }

  return {
    webmailUrl: process.env.EMAIL_WEBMAIL_URL ?? 'https://outlook.office.com/mail/',
    password,
  };
}
