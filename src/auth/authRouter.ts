import { Router } from "express";
import { json } from "body-parser";
import { checkPassword, createUser, sanitizeDbUser } from "../service/UserService";
import * as yup from "yup";
import { getUserByEmail } from "../data/UserRepo";
import { v4 } from "uuid";
import { sendEmail } from "../service/EmailService";

const authRouter = Router();

authRouter.use(json());

const startSession = (req: any, user: EUser) => {
  if (req && user) {
    req.session.user = user;
  }
};

authRouter.post("/login", async (req, res) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  const user = await checkPassword({ email, password });

  if (user) {
    startSession(req, user);
    res.send(user);
  } else {
    return res.sendStatus(401);
  }
});

authRouter.post("/logout", async (req, res) => {
  if (req.session) {
    req.session.user = null;
  }
  return res.sendStatus(200);
});

authRouter.post("/check", async (req, res) => {
  if (req.session?.user) {
    return res.json(req.session.user);
  } else {
    return res.sendStatus(401);
  }
});

authRouter.post("/register", async (req, res) => {
  // utility function
  function fail(message: string | null, e?: Error): void {
    const m = message || "Failed to create dev.";
    e && console.log(m, e);
    res.status(401).json({ message: m });
  }

  if (req.session?.user) {
    return fail("You are already logged in.");
  }

  let params;
  try {
    params = await yup
      .object()
      .shape({
        email: yup.string().email().max(100).required(),
        password: yup.string().min(8).max(64).required(),
        firstName: yup.string().max(50).required(),
        lastName: yup.string().max(50).required(),
      })
      .validate(req.body);
  } catch (e) {
    // don't do fail() this time, because it's a special case
    return res.status(400).json({
      message: "Validation failed",
      errors: e.errors,
    });
  }

  try {
    const { email, password, firstName, lastName } = params;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // no need to log, this is not an exception
      return fail("A dev with this email already exists in the database.");
    }
    const recordsAffected = await createUser({ email, password, firstName, lastName });
    if (!recordsAffected) {
      return fail("Failed to create user.");
    }
  } catch (e) {
    return fail(null, e);
  }

  try {
    let dbUser = await getUserByEmail(params.email);
    if (!dbUser) {
      return fail("Failed to create user.");
    }
    const newUser = sanitizeDbUser(dbUser);

    // TODO: set hash on user
    const token = v4();
    const confirmUrl = `https://devcollective.io/auth/confirm?${token}`;
    sendEmail({
      from: "noreply@devcollective.io",
      subject: "Confirm your account",
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
    res.json(newUser);
  } catch (e) {
    return fail(
      "Unexpected failure. User may or may not have been created. Aconfirmation email may not have been sent. Try logging in.",
    );
  }
});

export default authRouter;
