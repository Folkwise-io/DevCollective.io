import appFactory from "../appFactory";
import query, { MbQueryAgent } from "../test/query";
import { Express } from "express";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";

describe("Authentication", () => {
  let userParams = {
    email: "test@test.com",
    firstName: "John",
    lastName: "Doe",
    password: "password",
  };
  const expectedUser = {
    email: userParams.email,
    firstName: userParams.firstName,
    lastName: userParams.lastName,
  };
  let app: Express;
  let agent: MbQueryAgent;

  beforeAll(async (done) => {
    app = appFactory();
    await clearDatabase();
    await createUser(userParams);
    done();
  });

  beforeEach(() => {
    agent = query(app);
  });

  describe("login", () => {
    const login = async () =>
      agent
        .post("/auth/login", {
          email: userParams.email,
          password: userParams.password,
        })
        .expect(200);

    it("can log in", async (done) => {
      const response = await login();
      expect(response.body).toMatchObject(expectedUser);
      done();
    });

    it("can successfully check its own sessions", async (done) => {
      await login();
      const response = await agent.post("/auth/check");
      expect(response.body).toMatchObject(expectedUser);
      done();
    });
  });
});
