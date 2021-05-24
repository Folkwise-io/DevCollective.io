import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { createUser } from "../service/UserService";
import { clearDatabase } from "../../dev/test/TestRepo";

describe("Authentication", () => {
  let app: Express;

  beforeAll(async (done) => {
    app = appFactory();
    await clearDatabase();
    await createUser({
      email: "test@test.com",
      firstName: "John",
      lastName: "Doe",
      password: "password",
    });
    done();
  });

  describe("root user query", () => {
    it("can log in", async (done) => {
      const response = await query(app)
        .post("/auth/login", {
          email: "test@test.com",
          password: "password",
        })
        .expect(200);

      expect(response.body).toMatchObject({});

      done();
    });
  });
});
