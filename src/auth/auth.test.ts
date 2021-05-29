import appFactory from "../appFactory";
import query, { MbQueryAgent } from "../test/query";
import { Express } from "express";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import supertest from "supertest";
import { dataset_oneUser, user } from "../../dev/test/datasets/dataset-one-user";
import { datasetLoader } from "../../dev/test/datasetLoader";
import mockSgMail from "@sendgrid/mail";

// disable emails
jest.mock("@sendgrid/mail", () => ({
  send: jest.fn().mockResolvedValue(undefined),
  setApiKey: jest.fn(),
}));

describe("Authentication", () => {
  let app: Express;
  let user: any;
  let newUser: any;
  let getAgent = (): MbQueryAgent => query(app);
  let login: Function;
  let login_goodParams: Function;
  let check: Function;
  let register: Function;
  let expectedUser: any;

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const data = await datasetLoader("simple");
    user = data.users[0];
    login = (email: string, password: string, agent?: MbQueryAgent): supertest.Test => {
      const _agent = agent || getAgent();

      return _agent.post("/auth/login", {
        email,
        password,
      });
    };

    login_goodParams = (agent?: MbQueryAgent) => {
      const _agent = agent || getAgent();
      return login(user.email, "password", _agent);
    };

    check = (agent?: MbQueryAgent) => {
      const _agent = agent || getAgent();
      return _agent.post("/auth/check");
    };

    register = (
      opts: { firstName: string; lastName: string; email: string; password: string },
      agent?: MbQueryAgent,
    ) => {
      const _agent = agent || getAgent();
      const { firstName, lastName, email, password } = opts;

      return _agent.post("/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
    };

    expectedUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    newUser = { firstName: "New", lastName: "User", email: "new@user.com", password: "newpassword" };
  });

  describe("login", () => {
    describe("sunny cases", () => {
      it("can log in", async () => {
        const response = await login_goodParams().expect(200);
        expect(response.body).toMatchObject(expectedUser);
      });

      it("does not send back password or passwordHash", async () => {
        const response = await login_goodParams().expect(200);
        expect(response.body.password).toBeFalsy();
        expect(response.body.passwordHash).toBeFalsy();
      });

      it("accurately reports during /auth/check that a logged-out user is logged-out", async () => {
        return check().expect(401);
      });

      it("can successfully check its own sessions", async () => {
        const agent = getAgent();
        await login_goodParams(agent).expect(200);
        const response = await agent.post("/auth/check");
        expect(response.body).toMatchObject(expectedUser);
      });

      it("can perform a full login flow", async () => {
        const agent = getAgent();
        await agent.post("/auth/check").expect(401);
        const loginResponse = await login_goodParams(agent).expect(200);
        expect(loginResponse.body).toMatchObject(expectedUser);
        const checkResponse = await agent.post("/auth/check").expect(200);
        expect(checkResponse.body).toMatchObject(expectedUser);
        await agent.post("/auth/logout").expect(200);
        const checkResponseAfterLogout = await agent.post("/auth/check").expect(401);
        expect(checkResponseAfterLogout.body).toMatchObject({});
      });

      describe("registering a new user", () => {
        it("can register a new user", async () => {
          const agent = getAgent();

          const registerResponse = await register(
            {
              firstName: "New",
              lastName: "User",
              email: "new@user.com",
              password: "newpassword",
            },
            agent,
          );

          expect(registerResponse.statusCode).toBe(200);
          expect(registerResponse.body.id).toBeTruthy();
          expect(registerResponse.body.createdAt).toBeTruthy();
          expect(registerResponse.body.firstName).toBe(newUser.firstName);
          expect(registerResponse.body.lastName).toBe(newUser.lastName);
          expect(registerResponse.body.email).toBe(newUser.email);
          expect(registerResponse.body.password).toBeFalsy();
          expect(registerResponse.body.passwordHash).toBeFalsy();
          expect(mockSgMail.send).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("rainy cases", () => {
      it("can't log in with the wrong password", async () => {
        await login(user.email, "wrongpassword").expect(401);
      });
      it("can't log in with the wrong email", async () => {
        await login("wrongemail@test.com", user.password).expect(401);
      });
      it("can't log in with the wrong email and wrong password", async () => {
        await login("wrongemail@test.com", "wrongpassword").expect(401);
      });
      it("gets 401 when checking without logged in", async () => {
        const response = await check();
        expect(response.body).toEqual({});
      });

      describe("registration", () => {
        it("validates email", async () => {
          await register({ ...newUser, email: null }).expect(400);
          await register({ ...newUser, email: undefined }).expect(400);
          await register({ ...newUser, email: 0 }).expect(400);
          await register({ ...newUser, email: 1 }).expect(400);
          await register({ ...newUser, email: { email: "lol" } }).expect(400);
          await register({ ...newUser, email: {} }).expect(400);
          await register({ ...newUser, email: "bademail" }).expect(400);
          await register({ ...newUser, email: "bademail@" }).expect(400);
          await register({ ...newUser, email: "bademail.com" }).expect(400);
          await register({ ...newUser, email: "@bademail.com" }).expect(400);
          await register({ ...newUser, email: " @bademail.com" }).expect(400);
          await register({ ...newUser, email: "bademail@something" }).expect(400);
          await register({ ...newUser, email: " bademail@something" }).expect(400);
          await register({ ...newUser, email: "bademail@something " }).expect(400);
          await register({ ...newUser, email: "bademail " }).expect(400);
          await register({ ...newUser, email: "lol@bademail .com" }).expect(400);
          expect(mockSgMail.send).toHaveBeenCalledTimes(0);
        });

        it("validates a password of at least 8 characters in length.", async () => {
          await register({ ...newUser, password: undefined }).expect(400);
          await register({ ...newUser, password: null }).expect(400);
          await register({ ...newUser, password: {} }).expect(400);
          await register({ ...newUser, password: { password: "lol" } }).expect(400);
          await register({ ...newUser, password: { password: null } }).expect(400);
          await register({ ...newUser, password: "" }).expect(400);
          await register({ ...newUser, password: "t" }).expect(400);
          await register({ ...newUser, password: "to" }).expect(400);
          await register({ ...newUser, password: "too" }).expect(400);
          await register({ ...newUser, password: "toos" }).expect(400);
          await register({ ...newUser, password: "toosh" }).expect(400);
          await register({ ...newUser, password: "toosho" }).expect(400);
          await register({ ...newUser, password: "tooshor" }).expect(400);
          expect(mockSgMail.send).toHaveBeenCalledTimes(0);
          await register({ ...newUser, password: "NOTshort" }).expect(200);
          expect(mockSgMail.send).toHaveBeenCalledTimes(1);
        });

        it("requires a first name", async () => {
          await register({ ...newUser, firstName: undefined }).expect(400);
          await register({ ...newUser, firstName: null }).expect(400);
          await register({ ...newUser, firstName: {} }).expect(400);
          await register({ ...newUser, firstName: { firstName: "lol" } }).expect(400);
          await register({ ...newUser, firstName: { firstName: null } }).expect(400);
          await register({ ...newUser, firstName: "" }).expect(400);
          expect(mockSgMail.send).toHaveBeenCalledTimes(0);
        });
        it("requires a last name", async () => {
          await register({ ...newUser, lastName: undefined }).expect(400);
          await register({ ...newUser, lastName: null }).expect(400);
          await register({ ...newUser, lastName: {} }).expect(400);
          await register({ ...newUser, lastName: { lastName: "lol" } }).expect(400);
          await register({ ...newUser, lastName: { lastName: null } }).expect(400);
          await register({ ...newUser, lastName: "" }).expect(400);
          expect(mockSgMail.send).toHaveBeenCalledTimes(0);
        });
      });
    });
  });
});
