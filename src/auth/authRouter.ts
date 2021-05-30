import { Router } from "express";
import { json } from "body-parser";
import { checkPassword, createUser, sanitizeDbUser } from "../service/UserService";
import * as yup from "yup";
import { getUserByEmail, updateUser } from "../data/UserRepo";
import { v4 } from "uuid";
import { sendEmail } from "../service/EmailService";
import bcrypt from "bcrypt";

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

  let user: EUser | null = null;
  try {
    user = await checkPassword({ email, password });
  } catch (e) {
    console.error("Error while logging in", e);
    res.sendStatus(401);
  }

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

  const confirmationToken = v4();
  try {
    const { email, password, firstName, lastName } = params;
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      // no need to log, this is not an exception
      return fail("A dev with this email already exists in the database.");
    }
    const recordsAffected = await createUser({ email, password, firstName, lastName, confirmationToken });
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
    const confirmUrl = `https://devcollective.io/auth/token?${confirmationToken}&email=${encodeURIComponent(
      newUser.email,
    )}`;
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

authRouter.get("/confirmAccount", async (req, res) => {
  const schema = yup
    .object({
      email: yup.string().email().required(),
      confirm: yup.string().uuid().required(),
    })
    .noUnknown(true)
    .required();

  try {
    schema.validate(req.query);
  } catch (e) {
    if (e.name === "ValidationError") {
      return res.status(400).json({ errors: e.errors });
    } else {
      console.error(e);
      return res.status(400).json({ message: "Validation failed" });
    }
  }

  const email: string = req.query.email as string;
  const confirm: string = req.query.confirm as string;

  const user = await getUserByEmail(email);
  const isMatch = await bcrypt.compare(confirm, user.confirmationTokenHash);

  if (!isMatch) {
    return res.status(400).json({ message: "Validation failed" });
  }

  try {
    await updateUser(user.id, { confirmationTokenHash: null });
  } catch (e) {
    console.error("Failed to erase the confirmationTokenHash for the user", e);
  }

  res.status(200).send();
});

export default authRouter;
