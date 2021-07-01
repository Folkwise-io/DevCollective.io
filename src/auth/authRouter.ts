import bcrypt from "bcrypt";
import { json } from "body-parser";
import add from "date-fns/add";
import isBefore from "date-fns/isBefore";
import { Router } from "express";
import { v4 } from "uuid";
import * as yup from "yup";

import configProvider from "../configProvider";
import { getUserByEmail, updateUser } from "../data/UserRepo";
import { sendEmail } from "../service/EmailService";
import { checkPassword, createUser, sanitizeDbUser } from "../service/UserService";
import { validateEmail, validateFirstName, validateLastName, validatePassword, validateUuid } from "./validators";

const { MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE } = configProvider();
const authRouter = Router();

authRouter.use(json());

const startSession = (req: any, user: EUser) => {
  if (req && user) {
    req.session.user = user;
  }
};

authRouter.post(`/login`, async (req, res) => {
  let params;
  try {
    params = await yup
      .object()
      .shape({
        email: validateEmail,
        password: validatePassword,
      })
      .validate(req.body);
  } catch (e) {
    // don't do fail() this time, because it's a special case
    return res.status(400).json({
      message: `Validation failed`,
      errors: e.errors,
    });
  }

  const email: string = params.email;
  const password: string = params.password;

  let user: EUser | null = null;
  try {
    user = await checkPassword({ email, password });
  } catch (e) {
    console.error(`Error while logging in`, e);
    return res.sendStatus(401);
  }
  
  if (user) {
    startSession(req, user);
    return res.send(user);
  } else {
    return res.sendStatus(401);
  }
});

authRouter.post(`/logout`, async (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  return res.sendStatus(200);
});

authRouter.post(`/check`, async (req, res) => {
  req.session?.user ? res.json(req.session.user) : res.sendStatus(401)
});

authRouter.post(`/register`, async (req, res) => {
  // utility function
  function fail(message: string | null, e?: Error): void {
    const m = message || `Failed to create dev.`;
    e && console.error(m, e);
    res.status(401).json({ message: m });
    return;
  }

  if (req.session?.user) {
    return fail(`You are already logged in.`);
  }

  let params;
  try {
    params = await yup
      .object()
      .shape({
        email: validateEmail,
        password: validatePassword,
        firstName: validateFirstName,
        lastName: validateLastName,
      })
      .validate(req.body);
  } catch (e) {
    // don't do fail() this time, because it's a special case
    return res.status(400).json({
      message: `Validation failed`,
      errors: e.errors,
    });
  }

  const confirmationToken = v4();
  try {
    const { email, password, firstName, lastName } = params;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // no need to log, this is not an exception
      return fail(`A dev with this email already exists in the database.`);
    }
    const recordsAffected = await createUser({ email, password, firstName, lastName, confirmationToken });
    if (!recordsAffected) {
      return fail(`Failed to create user.`);
    }
  } catch (e) {
    return fail(null, e);
  }

  try {
    const dbUser = await getUserByEmail(params.email);
    if (!dbUser) {
      return fail(`Failed to create user.`);
    }
    const newUser = sanitizeDbUser(dbUser);

    // TODO: set hash on user
    const confirmUrl = `https://devcollective.io/auth/token?${confirmationToken}&email=${encodeURIComponent(
      newUser.email,
    )}`;
    sendEmail({
      from: `noreply@devcollective.io`,
      subject: `Confirm your account`,
      to: newUser.email,
      html: `
        Thank you for registering an account at <a href="https://devcollective.io">DevCollective.io</a>.<br/>
        To confirm your account, please click <a href="${confirmUrl}">here</a>, or visit the following URL:<br/>
        ${confirmUrl}<br/>
        Thank you,<br/>
        The DevCollective team.
        `,
    });

    startSession(req, newUser);
    return res.json(newUser);
  } catch (e) {
    return fail(
      `Unexpected failure. User may or may not have been created. Aconfirmation email may not have been sent. Try logging in.`,
    );
  }
});

authRouter.get(`/confirmAccount`, async (req, res) => {
  const schema = yup
    .object()
    .shape({
      email: validateEmail,
      confirm: validateUuid,
    })
    .noUnknown(true)
    .required();

  try {
    await schema.validate(req.query);
  } catch (e) {
    if (e.name === `ValidationError`) {
      return res.status(400).json({ errors: e.errors });
    } else {
      console.error(e);
      return res.status(400).json({ message: `Validation failed` });
    }
  }

  const email: string = req.query.email as string;
  const confirm: string = req.query.confirm as string;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(400).json({ message: `Validation failed` });
  }
  if (!user.confirmationTokenHash) {
    return res.status(409).json({ message: `Account already validated.` });
  }

  const isMatch = await bcrypt.compare(confirm, user.confirmationTokenHash);

  if (!isMatch) {
    return res.status(400).json({ message: `Validation failed` });
  }

  try {
    await updateUser(user.id, { confirmationTokenHash: null });
  } catch (e) {
    console.error(`Failed to erase the confirmationTokenHash for the user`, e);
  }

  return res.sendStatus(200);
});

authRouter.post(`/forgot/request`, async (req, res) => {
  try {
    const schema = yup
      .object()
      .shape({
        email: validateEmail,
      })
      .strict(true)
      .noUnknown(true);

    await schema.validate(req.body);
  } catch (e) {
    return res.sendStatus(400);
  }

  const user = await getUserByEmail(req.body.email as string);
  if (!user) {
    // Obscure 200 for security purposes.
    return res.sendStatus(200);
  }

  // user exists. continue.

  const forgotPasswordToken = v4();
  const forgotPasswordTokenHash = await bcrypt.hash(forgotPasswordToken, 10);

  await updateUser(user.id, {
    forgotPasswordTokenHash: forgotPasswordTokenHash,
    forgotPasswordExpiry: add(new Date(), { days: MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE }),
  });

  const confirmUrl = `https://devcollective.io/auth/token?${forgotPasswordToken}&email=${encodeURIComponent(
    user.email,
  )}`;

  await sendEmail({
    from: `noreply@devcollective.io`,
    to: user.email,
    subject: `Your password reset link.`,
    html: `
      We received a forgot password request from this email.<br/>
      To reset your password, please click <a href="${confirmUrl}">here</a>, or visit the following URL:<br/>
      ${confirmUrl}<br/>
      Thank you,<br/>
      The DevCollective team.
    `,
  });

  res.sendStatus(200);
});

authRouter.post(`/forgot/confirm`, async (req, res) => {
  try {
    const schema = yup
      .object()
      .shape({
        email: validateEmail,
        token: validateUuid,
        password: validatePassword,
      })
      .strict(true)
      .noUnknown(true);

    await schema.validate(req.body);
  } catch (e) {
    return res.sendStatus(400);
  }

  const user = await getUserByEmail(req.body.email);

  if (
    !user ||
    !user.forgotPasswordTokenHash ||
    !user.forgotPasswordExpiry ||
    isBefore(user.forgotPasswordExpiry, new Date())
  ) {
    return res.sendStatus(401);
  }

  const isMatch = await bcrypt.compare(req.body.token, user.forgotPasswordTokenHash);

  if (!isMatch) {
    return res.sendStatus(401);
  }

  // success!
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  await updateUser(user.id, { passwordHash, forgotPasswordExpiry: null, forgotPasswordTokenHash: null });

  res.sendStatus(200);
});

export default authRouter;
