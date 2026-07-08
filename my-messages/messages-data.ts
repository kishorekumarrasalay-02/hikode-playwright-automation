export type MessageRecipient = {
  search: string;
  displayName: string;
};

export const MESSAGE_RECIPIENTS: MessageRecipient[] = [
  { search: 'Kishore', displayName: 'Kishore Babu' },
  { search: 'Jagadeesh', displayName: 'Jagadeesh' },
  { search: 'Lokesh', displayName: 'Lokesh' },
  { search: 'Kiran', displayName: 'Kiran' },
  { search: 'Ann', displayName: 'Ann' },
  { search: 'Aditya', displayName: 'Aditya' },
];

export function generateGreeting(displayName: string): string {
  const firstName = displayName.split(' ')[0];
  return `Hello ${firstName},

Greetings! I hope you are doing well. I wanted to reach out and connect with you on HiKode.

Wishing you a great day!

Best regards`;
}
