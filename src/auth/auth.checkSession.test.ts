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

describe("Check Session", () => {
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
  });

  describe("rainy", () => {
    it("gets 401 when checking without logged in", async () => {
      const response = await tm.check();
      expect(response.body).toEqual({});
    });
  });
});
