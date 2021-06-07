<<<<<<< HEAD
import appFactory from "../appFactory";
import { Express } from "express";
import TestManager from "../test/TestManager";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import { datasetLoader } from "../../dev/test/datasetLoader";
import sgMail from "@sendgrid/mail";
import { getUserByEmail, getUserById } from "../data/UserRepo";
import { v4 } from "uuid";
import { PromiseValue } from "type-fest";
import { extractUuidTokenFromEmail, getSentEmail } from "../test/utils";

// disable emails
jest.mock("@sendgrid/mail");

describe("Authentication", () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

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
  });

  describe("validations", () => {
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

      // lowercase only
      await tm.register({ ...newUser, email: "UPPERCASE@EMAIL.COM" }).expect(400);
      await tm.register({ ...newUser, email: "lowerCamel@email.com" }).expect(400);
      await tm.register({ ...newUser, email: "UpperCamel@email.com" }).expect(400);
      await tm.register({ ...newUser, email: "user@EMAIL.com" }).expect(400);
      await tm.register({ ...newUser, email: "user@email.COM" }).expect(400);

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
  });

  describe("behaviour", () => {
    it("correctly performs accountConfirmation flag behaviour", async () => {
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

  describe("rainy", () => {
    it("fails account confirmation if confirmationToken not in query param.", async () => {
      const response = await tm.submitAccountConfirmationToken({
        confirmationToken: undefined,
        email: "user@user.com",
      });
      expect(response.statusCode).toBe(400);
    });

    it("fails account confirmation if confirmationToken is not uuid", async () => {
      const response = await tm.submitAccountConfirmationToken({
        confirmationToken: "not-uuid",
        email: "user@user.com",
      });
      expect(response.body.errors.length).toBe(1);
    });

    it("fails account confirmation if an email is not in the query param.", async () => {
      const response = await tm.submitAccountConfirmationToken({
        email: undefined,
        confirmationToken: v4(),
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors.length).toBe(1);
    });

    it("fails account confirmation if email string is not email format.", async () => {
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
=======
import appFactory from "../appFactory";
import { Express } from "express";
import TestManager from "../test/TestManager";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import { datasetLoader } from "../../dev/test/datasetLoader";
import sgMail from "@sendgrid/mail";
import { getUserByEmail, getUserById } from "../data/UserRepo";
import { v4 } from "uuid";
import { PromiseValue } from "type-fest";
import { extractUuidTokenFromEmail, getSentEmail } from "../test/utils";

// disable emails
jest.mock("@sendgrid/mail");

describe("Authentication", () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

  const newUser = { firstName: "New", lastName: "User", email: "new@user.com", password: "newpassword" };

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    data = await datasetLoader();
    tm = new TestManager(app);
  });

  describe("sunny", () => {
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
  });

  describe("validations", () => {
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

      // lowercase only
      await tm.register({ ...newUser, email: "UPPERCASE@EMAIL.COM" }).expect(400);
      await tm.register({ ...newUser, email: "lowerCamel@email.com" }).expect(400);
      await tm.register({ ...newUser, email: "UpperCamel@email.com" }).expect(400);
      await tm.register({ ...newUser, email: "user@EMAIL.com" }).expect(400);
      await tm.register({ ...newUser, email: "user@email.COM" }).expect(400);

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
  });

  describe("behaviour", () => {
    it("correctly performs accountConfirmation flag behaviour", async () => {
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

  describe("rainy", () => {
    it("fails account confirmation if confirmationToken not in query param.", async () => {
      const response = await tm.submitAccountConfirmationToken({
        confirmationToken: undefined,
        email: "user@user.com",
      });
      expect(response.statusCode).toBe(400);
    });

    it("fails account confirmation if confirmationToken is not uuid", async () => {
      const response = await tm.submitAccountConfirmationToken({
        confirmationToken: "not-uuid",
        email: "user@user.com",
      });
      expect(response.body.errors.length).toBe(1);
    });

    it("fails account confirmation if an email is not in the query param.", async () => {
      const response = await tm.submitAccountConfirmationToken({
        email: undefined,
        confirmationToken: v4(),
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.errors.length).toBe(1);
    });

    it("fails account confirmation if email string is not email format.", async () => {
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
>>>>>>> 96f06fc11fa1f55f86da9ccddc9c8db27ccf30a2
