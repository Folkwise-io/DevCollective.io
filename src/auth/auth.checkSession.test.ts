import { Express } from "express";
import { PromiseValue } from "type-fest";

import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import appFactory from "../appFactory";
import TestManager from "../test/TestManager";
import { getDefaultUser } from "../test/utils";

// disable emails
jest.mock(`@sendgrid/mail`);

describe(`Check Session`, () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

  const defaultPassword = `password`;

  beforeAll(async () => {
    app = appFactory();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    data = await datasetLoader();
    tm = new TestManager(app);
  });

  describe(`sunny`, () => {
    it(`accurately reports during /auth/check that a logged-out user is logged-out`, async () => {
      return tm.check().expect(401);
    });

    it(`can successfully check its own sessions`, async () => {
      const { firstName, lastName, email } = getDefaultUser(data);
      const loginResponse = await tm.login(email, defaultPassword).expect(200);
      expect(loginResponse.body).toMatchObject({ firstName, lastName, email });
      const response = await tm.check();
      expect(response.body).toMatchObject({ firstName, lastName, email });
    });
  });

  describe(`rainy`, () => {
    it(`gets 401 when checking without logged in`, async () => {
      const response = await tm.check();
      expect(response.body).toEqual({});
    });
  });
});
