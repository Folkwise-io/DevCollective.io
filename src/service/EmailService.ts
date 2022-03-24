import sgMail from "@sendgrid/mail";

import configProvider from "../configProvider";

const { SENDGRID_KEY, SENDGRID_PRINT_ONLY } = configProvider();

if (!SENDGRID_PRINT_ONLY) {
  sgMail.setApiKey(SENDGRID_KEY);
}

interface Email {
  to: string;
  from: string;
  subject: string;
  html: string;
}

export const sendEmail = (email: Email): void => {
  if (SENDGRID_PRINT_ONLY) {
    console.info(`EMAIL: ${JSON.stringify(email)}`);
  } else {
    sgMail.send(email);
  }
};
