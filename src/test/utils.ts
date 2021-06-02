import { MailService } from "@sendgrid/mail";

export function getSentEmail(mailer: MailService) {
  // @ts-expect-error mock is not officially on the types here.
  return mailer.send.mock.calls[0]?.[0]?.html;
}

export const getDefaultUser = (dataset: any) => {
  return dataset.users[0];
};

export const extractUuidTokenFromEmail = (email: string): string | null => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i;
  const uuid = email && email.match(uuidRegex);
  return uuid ? uuid[0] : null;
};
