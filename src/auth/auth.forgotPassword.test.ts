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

  describe("rainy", () => {
    it("does not allow an expired token to be used.", async () => {
      const user = getDefaultUser(data);
      const token = v4();
      const hash = await bcrypt.hash(token, 10);
      await updateUser(user.id, {
        forgotPasswordTokenHash: hash,
        forgotPasswordExpiry: subDays(new Date(), 1),
      });

      await tm.forgotConfirm({ email: user.email, token, password: "someNewPassword" }).expect(401);
    });
    it("only allows a token to be used once.", async () => {
      const user = getDefaultUser(data);

      // update user with a forgotPassword token.
      const token = v4();
      const hash = await bcrypt.hash(token, 10);
      await updateUser(user.id, {
        forgotPasswordTokenHash: hash,
        forgotPasswordExpiry: addDays(new Date(), 1),
      });

      const newPassword = "someNewPassword";
      // confirm that login works with old password
      await tm.login(user.email, defaultPassword).expect(200);
      // change the password
      await tm.forgotConfirm({ email: user.email, token, password: newPassword }).expect(200);
      // old password no longer works
      await tm.login(user.email, defaultPassword).expect(401);
      // new password works
      await tm.login(user.email, newPassword).expect(200);
      // old token no longer resets the password
      await tm.forgotConfirm({ email: user.email, token, password: "someNewPassword" }).expect(401);
      // confirm old password still does not work
      await tm.login(user.email, defaultPassword).expect(401);
      // confirm new password still works.
      await tm.login(user.email, newPassword).expect(200);
    });
    it("fails bad request when no email is sent, or when a bad email is sent", async () => {
      // test bad data
      const forgotPasswordUrl = "/auth/forgot/request";
      await tm.raw().post(forgotPasswordUrl).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: null }).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: undefined }).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: true }).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: false }).expect(400);
      await tm.raw().post(forgotPasswordUrl, 0).expect(400);
      await tm.raw().post(forgotPasswordUrl, 1).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: "lol" }).expect(400);
      await tm.raw().post(forgotPasswordUrl, {}).expect(400);
      await tm.raw().post(forgotPasswordUrl, { email: "good@email.com", other: "some-unexpected-data" }).expect(400);

      // test bad emails
      await tm.forgotRequest("bademail").expect(400);
      await tm.forgotRequest("bademail@").expect(400);
      await tm.forgotRequest("bademail.com").expect(400);
      await tm.forgotRequest("@bademail.com").expect(400);
      await tm.forgotRequest(" @bademail.com").expect(400);
      await tm.forgotRequest("bademail@something").expect(400);
      await tm.forgotRequest(" bademail@something").expect(400);
      await tm.forgotRequest("bademail@something ").expect(400);
      await tm.forgotRequest("bademail ").expect(400);
      await tm.forgotRequest("lol@bademail .com").expect(400);
      expect(sgMail.send).toHaveBeenCalledTimes(0);
    });
    it("should send a 200 and do nothing when the email does not exist", async () => {
      const badEmail = "doesnotexist@email.com";

      // this user should not exist
      const dbUser = await getUserByEmail(badEmail);
      expect(dbUser).toBeFalsy();

      // request should still look like it succeeded
      await tm.forgotRequest(badEmail).expect(200);

      // no email should have been sent
      expect(sgMail.send).toHaveBeenCalledTimes(0);
    });
  });
});
