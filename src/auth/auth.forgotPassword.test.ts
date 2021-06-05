import appFactory from "../appFactory";
import { Express } from "express";
import TestManager from "../test/TestManager";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import { datasetLoader } from "../../dev/test/datasetLoader";
import sgMail from "@sendgrid/mail";
import { getUserByEmail, getUserById, updateUser } from "../data/UserRepo";
import { v4 } from "uuid";
import { PromiseValue } from "type-fest";
import bcrypt from "bcrypt";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import { extractUuidTokenFromEmail, getDefaultUser, getSentEmail } from "../test/utils";

// disable emails
jest.mock("@sendgrid/mail");

describe("Forgot Password", () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

  const defaultPassword = "password";
  const newUser = { firstName: "New", lastName: "User", email: "new@user.com", password: "newpassword" };

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    data = await datasetLoader("simple");
    tm = new TestManager(app);
  });

  describe("sunny", () => {
    it("successfully sends a forgot password reset email", async () => {
      const email = getDefaultUser(data).email;
      // before request, user should not have forgotPasswordTokenHash
      {
        const dbUser = await getUserByEmail(email);
        expect(dbUser.forgotPasswordTokenHash).toBeFalsy();
        expect(dbUser.forgotPasswordExpiry).toBeFalsy();
      }

      await tm.forgotRequest(email).expect(200);

      // after request, user should not have forgotPasswordTokenHash
      {
        const dbUser = await getUserByEmail(email);
        expect(dbUser.forgotPasswordTokenHash).toBeTruthy();
        expect(dbUser.forgotPasswordExpiry).toBeTruthy();
      }

      // test that email was sent correctly
      expect(sgMail.send).toHaveBeenCalledTimes(1);
      const sentHtml = getSentEmail(sgMail);
      const confirmationToken = extractUuidTokenFromEmail(sentHtml);
      expect(confirmationToken).toBeTruthy();
    });

    it("successfully resets a user's password with a good token.", async () => {
      // check that i can log in with existing password
      const { email } = getDefaultUser(data);

      await tm.login(email, defaultPassword).expect(200);

      // check that i cannot log in with new password
      await tm.login("bademail@email.com", "somepassword");

      await tm.forgotRequest(email).expect(200);
      const sentHtml = getSentEmail(sgMail);
      expect(sentHtml).toBeTruthy();
      const token = extractUuidTokenFromEmail(sentHtml);

      // instead of visiting the GET url, directly POST to the /forgot/confirm endpoint
      const newPassword = "thisisanewpassword";
      await tm.forgotConfirm({ email, token, password: newPassword }).expect(200);

      // check that i cannot log in with existing password
      await tm.login(email, defaultPassword).expect(401);

      // check that i can log in with new password
      await tm.login(email, newPassword);

      // check that i cannot use the same token to reset again
      await tm.forgotConfirm({ email: email, token, password: newPassword }).expect(401);
    });
  });
});
