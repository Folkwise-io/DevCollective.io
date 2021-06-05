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

describe("Authentication", () => {
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

  describe("forgot password", () => {
    describe("sunny", () => {});

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

  describe("login", () => {
    describe("sunny cases", () => {
      it("can log in", async () => {
        const { firstName, lastName, email } = getDefaultUser(data);
        const response = await tm.login(email, defaultPassword).expect(200);
        expect(response.body).toMatchObject({
          email,
          firstName,
          lastName,
        });
      });

      it("does not send back password or passwordHash", async () => {
        const { firstName, lastName, email } = getDefaultUser(data);
        const response = await tm.login(email, defaultPassword).expect(200);
        expect(response.body.password).toBeFalsy();
        expect(response.body.passwordHash).toBeFalsy();
      });

      it("accurately reports during /auth/check that a logged-out user is logged-out", async () => {
        return tm.check().expect(401);
      });

      it("can successfully check its own sessions", async () => {
        const { firstName, lastName, email } = getDefaultUser(data);
        const loginResponse = await tm.login(email, defaultPassword).expect(200);
        expect(loginResponse.body).toMatchObject({ firstName, lastName, email });
        const response = await tm.check();
        expect(response.body).toMatchObject({ firstName, lastName, email });
      });

      it("can perform a full login flow", async () => {
        await tm.check().expect(401);

        const { firstName, lastName, email } = getDefaultUser(data);
        const loginResponse = await tm.login(email, defaultPassword).expect(200);

        expect(loginResponse.body).toMatchObject({ firstName, lastName, email });
        const checkResponse = await tm.check().expect(200);
        expect(checkResponse.body).toMatchObject({ firstName, lastName, email });
        await tm.logout().expect(200);
        const checkResponseAfterLogout = await tm.check().expect(401);
        expect(checkResponseAfterLogout.body).toMatchObject({});
      });

      describe("registering a new user", () => {
        it("can register a new user", async () => {
          const registerResponse = await tm.register({
            firstName: "New",
            lastName: "User",
            email: "new@user.com",
            password: "newpassword",
          });

          expect(registerResponse.statusCode).toBe(200);
          expect(registerResponse.body.id).toBeTruthy();
          expect(registerResponse.body.createdAt).toBeTruthy();
          expect(registerResponse.body.firstName).toBe(newUser.firstName);
          expect(registerResponse.body.lastName).toBe(newUser.lastName);
          expect(registerResponse.body.email).toBe(newUser.email);
          expect(registerResponse.body.password).toBeFalsy();
          expect(registerResponse.body.passwordHash).toBeFalsy();
          expect(sgMail.send).toHaveBeenCalledTimes(1);
        });

        it("Successfully sets a confirmation token in the db.", async () => {
          const response = await tm.register({
            firstName: "New",
            lastName: "User",
            email: "new@user.com",
            password: "newpassword",
          });

          expect(response.statusCode).toBe(200);

          const dbUser = await getUserById(response.body.id);
          expect(dbUser.id).toBeTruthy();
        });

        it("Successfully sends an email with a password confirmation token.", async () => {
          const response = await tm.register({
            firstName: "New",
            lastName: "User",
            email: "new@user.com",
            password: "newpassword",
          });

          expect(response.statusCode).toBe(200);

          const sentHtml = getSentEmail(sgMail);
          const confirmationToken = extractUuidTokenFromEmail(sentHtml);
          expect(confirmationToken).toBeTruthy();
        });

        it("accountConfirmation flag behaviour", async () => {
          const confirmationToken = "9123f99b-e69b-4816-8e27-536856162f26";
          const email = "new@user.com";
          const password = "password";

          // confirm the user doesnt exist in the db
          const userNotYetCreated = await getUserByEmail(email);
          expect(userNotYetCreated).toBeFalsy();

          // create the user
          await createUser({
            email,
            firstName: "new",
            lastName: "user",
            password,
            confirmationToken,
          });

          // check that the user exists in the db with the confirmationToken
          const createdUser = await getUserByEmail(email);
          expect(createdUser).toBeTruthy();
          expect(createdUser.confirmationTokenHash).toBeTruthy();

          // login and check to see if the response has the flag
          const loginResponse = await tm.login(createdUser.email, password);
          expect(loginResponse.statusCode).toBe(200);
          expect(loginResponse.body.accountConfirmationPending).toBeTruthy();

          // check that the "check" response returns a flag.
          const checkResponse1 = await tm.check();
          expect(checkResponse1.body.accountConfirmationPending).toBeTruthy();

          // confirm the confirmationToken and check the response
          const confirmationResponse = await tm.submitAccountConfirmationToken({ confirmationToken, email });
          expect(confirmationResponse.statusCode).toBe(200);

          // check that the "check" response no longer returns a flag.
          const checkResponse2 = await tm.check();
          expect(checkResponse2.body.accountConfirmationPending).toBeTruthy();

          // check that the user no longer has a confirmationTokenHash
          const createdUser2 = await getUserByEmail(email);
          expect(createdUser2).toBeTruthy();
          expect(createdUser2.id).toEqual(createdUser.id);
          expect(createdUser2.confirmationTokenHash).toBeFalsy();

          // login with a new agent and check to confirm the flag is gone
          // this fork is only used in a couple of calls this test.
          const tm2 = tm.fork();
          const loginResponse2 = await tm2.login(email, password).expect(200);
          expect(loginResponse2.body.accountConfirmationPending).toBeFalsy();

          // check that the "check" response on a new session no longer returns a flag.
          const checkResponse3 = await tm2.check();
          expect(checkResponse3.body.accountConfirmationPending).toBeFalsy();
        });

        it("Successfully confirms an account with a confirmationToken", async () => {
          const confirmationToken = "9123f99b-e69b-4816-8e27-536856162f26";
          const email = "new@user.com";

          // confirm the user doesnt exist in the db
          const userNotYetCreated = await getUserByEmail(email);
          expect(userNotYetCreated).toBeFalsy();

          // create the user
          await createUser({
            email,
            firstName: "new",
            lastName: "user",
            password: "password",
            confirmationToken,
          });

          // check that the user exists in the db with the confirmationToken
          const createdUser = await getUserByEmail(email);
          expect(createdUser).toBeTruthy();
          expect(createdUser.confirmationTokenHash).toBeTruthy();

          // confirm the confirmationToken and check the response
          const confirmationResponse = await tm.submitAccountConfirmationToken({ confirmationToken, email });
          expect(confirmationResponse.statusCode).toBe(200);

          // check that the user no longer has a confirmationTokenHash
          const createdUser2 = await getUserByEmail(email);
          expect(createdUser2).toBeTruthy();
          expect(createdUser2.id).toEqual(createdUser.id);
          expect(createdUser2.confirmationTokenHash).toBeFalsy();
        });
      });
    });

    describe("rainy cases", () => {
      it("can't log in with the wrong password", async () => {
        const { email } = getDefaultUser(data);
        await tm.login(email, "wrongpassword").expect(401);
      });
      it("can't log in with the wrong email", async () => {
        await tm.login("wrongemail@test.com", defaultPassword).expect(401);
      });
      it("can't log in with the wrong email and wrong password", async () => {
        await tm.login("wrongemail@test.com", "wrongpassword").expect(401);
      });
      it("gets 401 when checking without logged in", async () => {
        const response = await tm.check();
        expect(response.body).toEqual({});
      });

      describe("login", () => {
        it("validates email", async () => {
          await tm.login(null, defaultPassword).expect(400);
          await tm.login(undefined, defaultPassword).expect(400);
          await tm.login(0, defaultPassword).expect(400);
          await tm.login(1, defaultPassword).expect(400);
          await tm.login({ email: "lol" }, defaultPassword).expect(400);
          await tm.login({}, defaultPassword).expect(400);
          await tm.login("bademail", defaultPassword).expect(400);
          await tm.login("bademail@", defaultPassword).expect(400);
          await tm.login("bademail.com", defaultPassword).expect(400);
          await tm.login("@bademail.com", defaultPassword).expect(400);
          await tm.login(" @bademail.com", defaultPassword).expect(400);
          await tm.login("bademail@something", defaultPassword).expect(400);
          await tm.login(" bademail@something", defaultPassword).expect(400);
          await tm.login("bademail@something ", defaultPassword).expect(400);
          await tm.login("bademail ", defaultPassword).expect(400);
          await tm.login("lol@bademail .com", defaultPassword).expect(400);
          expect(sgMail.send).toHaveBeenCalledTimes(0);
        });

        it("requires a password of at least 8 characters in length.", async () => {
          const user = newUser;

          await tm.login(user.email, undefined).expect(400);
          await tm.login(user.email, null).expect(400);
          await tm.login(user.email, {}).expect(400);
          await tm.login(user.email, "lol").expect(400);
          await tm.login(user.email, null).expect(400);
          await tm.login(user.email, "").expect(400);
          await tm.login(user.email, "t").expect(400);
          await tm.login(user.email, "to").expect(400);
          await tm.login(user.email, "too").expect(400);
          await tm.login(user.email, "toos").expect(400);
          await tm.login(user.email, "toosh").expect(400);
          await tm.login(user.email, "toosho").expect(400);
          await tm.login(user.email, "tooshor").expect(400);

          // the next one has the right length. but again, it's not a valid user email...
          // so we expect a 401 instead of a 400.
          await tm.login(user.email, "NOTshort").expect(401);
        });
      });

      describe("registration", () => {
        it("validates email", async () => {
          await tm.register({ ...newUser, email: null }).expect(400);
          await tm.register({ ...newUser, email: undefined }).expect(400);
          await tm.register({ ...newUser, email: 0 }).expect(400);
          await tm.register({ ...newUser, email: 1 }).expect(400);
          await tm.register({ ...newUser, email: { email: "lol" } }).expect(400);
          await tm.register({ ...newUser, email: {} }).expect(400);
          await tm.register({ ...newUser, email: "bademail" }).expect(400);
          await tm.register({ ...newUser, email: "bademail@" }).expect(400);
          await tm.register({ ...newUser, email: "bademail.com" }).expect(400);
          await tm.register({ ...newUser, email: "@bademail.com" }).expect(400);
          await tm.register({ ...newUser, email: " @bademail.com" }).expect(400);
          await tm.register({ ...newUser, email: "bademail@something" }).expect(400);
          await tm.register({ ...newUser, email: " bademail@something" }).expect(400);
          await tm.register({ ...newUser, email: "bademail@something " }).expect(400);
          await tm.register({ ...newUser, email: "bademail " }).expect(400);
          await tm.register({ ...newUser, email: "lol@bademail .com" }).expect(400);
          expect(sgMail.send).toHaveBeenCalledTimes(0);
        });

        it("requires a password of at least 8 characters in length.", async () => {
          await tm.register({ ...newUser, password: undefined }).expect(400);
          await tm.register({ ...newUser, password: null }).expect(400);
          await tm.register({ ...newUser, password: {} }).expect(400);
          await tm.register({ ...newUser, password: { password: "lol" } }).expect(400);
          await tm.register({ ...newUser, password: { password: null } }).expect(400);
          await tm.register({ ...newUser, password: "" }).expect(400);
          await tm.register({ ...newUser, password: "t" }).expect(400);
          await tm.register({ ...newUser, password: "to" }).expect(400);
          await tm.register({ ...newUser, password: "too" }).expect(400);
          await tm.register({ ...newUser, password: "toos" }).expect(400);
          await tm.register({ ...newUser, password: "toosh" }).expect(400);
          await tm.register({ ...newUser, password: "toosho" }).expect(400);
          await tm.register({ ...newUser, password: "tooshor" }).expect(400);
          expect(sgMail.send).toHaveBeenCalledTimes(0);
          expect(await getUserByEmail(newUser.email)).toBeFalsy();
          await tm.register({ ...newUser, password: "NOTshort" }).expect(200);
          expect(sgMail.send).toHaveBeenCalledTimes(1);
          expect(await getUserByEmail(newUser.email)).toBeTruthy();
        });

        it("requires a first name", async () => {
          await tm.register({ ...newUser, firstName: undefined }).expect(400);
          await tm.register({ ...newUser, firstName: null }).expect(400);
          await tm.register({ ...newUser, firstName: {} }).expect(400);
          await tm.register({ ...newUser, firstName: { firstName: "lol" } }).expect(400);
          await tm.register({ ...newUser, firstName: { firstName: null } }).expect(400);
          await tm.register({ ...newUser, firstName: "" }).expect(400);
          expect(sgMail.send).toHaveBeenCalledTimes(0);
        });
        it("requires a last name", async () => {
          await tm.register({ ...newUser, lastName: undefined }).expect(400);
          await tm.register({ ...newUser, lastName: null }).expect(400);
          await tm.register({ ...newUser, lastName: {} }).expect(400);
          await tm.register({ ...newUser, lastName: { lastName: "lol" } }).expect(400);
          await tm.register({ ...newUser, lastName: { lastName: null } }).expect(400);
          await tm.register({ ...newUser, lastName: "" }).expect(400);
          expect(sgMail.send).toHaveBeenCalledTimes(0);
        });

        it("account confirmation fails if confirmationToken not in query param.", async () => {
          const response = await tm.submitAccountConfirmationToken({
            confirmationToken: undefined,
            email: "user@user.com",
          });
          expect(response.statusCode).toBe(400);
        });

        it("account confirmation fails if confirmationToken is not uuid", async () => {
          const response = await tm.submitAccountConfirmationToken({
            confirmationToken: "not-uuid",
            email: "user@user.com",
          });
          expect(response.body.errors.length).toBe(1);
        });

        it("account confirmation requires an email in the query param.", async () => {
          const response = await tm.submitAccountConfirmationToken({
            email: undefined,
            confirmationToken: v4(),
          });
          expect(response.statusCode).toBe(400);
          expect(response.body.errors.length).toBe(1);
        });

        it("account confirmation fails if email string is not email format.", async () => {
          const response = await tm.submitAccountConfirmationToken({
            email: "not-email",
            confirmationToken: v4(),
          });
          expect(response.statusCode).toBe(400);
          expect(response.body.errors.length).toBe(1);
        });

        it("will not confirm an account that has no confirmationToken in the database", async () => {
          const confirmationToken = "9123f99b-e69b-4816-8e27-536856162f26";
          const email = "new@user.com";

          // confirm the user doesnt exist in the db
          const userNotYetCreated = await getUserByEmail(email);
          expect(userNotYetCreated).toBeFalsy();

          // create the user
          await createUser({
            email,
            firstName: "new",
            lastName: "user",
            password: "password",
            confirmationToken: undefined,
          });

          // check that the user exists in the db WITHOUT the confirmationToken
          const createdUser = await getUserByEmail(email);
          expect(createdUser).toBeTruthy();
          expect(createdUser.confirmationTokenHash).toBeFalsy();

          // confirm the confirmationToken and check the response.
          // This is a failing call.
          const confirmationResponse = await tm.submitAccountConfirmationToken({ confirmationToken, email });
          expect(confirmationResponse.statusCode).toBe(409);

          // check that the user still has no confirmationTokenHash
          const createdUser2 = await getUserByEmail(email);
          expect(createdUser2).toBeTruthy();
          expect(createdUser2.confirmationTokenHash).toBeFalsy();
        });
        it("will not confirm an account that does not exist", async () => {
          const confirmationToken = "9123f99b-e69b-4816-8e27-536856162f26";
          const email = "new@user.com";

          // ensure the user doesnt exist in the db
          const userNotYetCreated = await getUserByEmail(email);
          expect(userNotYetCreated).toBeFalsy();

          // confirm the confirmationToken and check the response
          const confirmationResponse = await tm.submitAccountConfirmationToken({ confirmationToken, email });
          expect(confirmationResponse.statusCode).toBe(400);

          // check that the user still does not exist
          const userNotYetCreated2 = await getUserByEmail(email);
          expect(userNotYetCreated2).toBeFalsy();
        });
      });
    });
  });
});
