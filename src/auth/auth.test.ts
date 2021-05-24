import appFactory from "../appFactory";
import query, { MbQueryAgent } from "../test/query";
import { Express } from "express";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import supertest from "supertest";
import { dataset_oneUser, user } from "../../dev/test/datasets/dataset-one-user";
import { datasetLoader } from "../../dev/test/datasetLoader";

describe("Authentication", () => {
  let app: Express;
  let user: any;
  let getAgent = (): MbQueryAgent => query(app);
  let login: Function;
  let login_goodParams: Function;
  let check: Function;
  let expectedUser: any;

  beforeAll(async () => {
    app = appFactory();
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

    expectedUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  });

  describe("login", () => {
    describe("sunny cases", () => {
      it("can log in", async () => {
        const response = await login_goodParams().expect(200);
        expect(response.body).toMatchObject(expectedUser);
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
    });
  });
});
