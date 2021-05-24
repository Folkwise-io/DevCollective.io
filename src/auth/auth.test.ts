import appFactory from "../appFactory";
import query, { MbQueryAgent } from "../test/query";
import { Express } from "express";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";
import supertest from "supertest";
import { dataset_oneUser, user } from "../../dev/test/datasets/dataset-one-user";

describe("Authentication", () => {
  let app: Express;
  let getAgent = (): MbQueryAgent => query(app);

  // utilities *****************************************************************

  const login = (email: string, password: string, agent?: MbQueryAgent): supertest.Test => {
    const _agent = agent || getAgent();

    return _agent.post("/auth/login", {
      email,
      password,
    });
  };

  const login_goodParams = (agent?: MbQueryAgent) => {
    const _agent = agent || getAgent();
    return login(user.email, user.password, _agent);
  };

  const check = (agent?: MbQueryAgent) => {
    const _agent = agent || getAgent();
    return _agent.post("/auth/check");
  };

  const expectedUser = {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  // ***************************************************************************

  beforeAll(async () => {
    app = appFactory();
  });

  beforeEach(async () => {
    await dataset_oneUser();
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
