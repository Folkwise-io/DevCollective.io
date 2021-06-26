import sgMail from "@sendgrid/mail";
import { Express } from "express";
import { PromiseValue } from "type-fest";

import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import appFactory from "../appFactory";
import TestManager from "../test/TestManager";
import { getDefaultUser } from "../test/utils";

// disable emails
jest.mock(`@sendgrid/mail`);

describe(`Authentication`, () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

  const defaultPassword = `password`;
  const newUser = { firstName: `New`, lastName: `User`, email: `new@user.com`, password: `newpassword` };

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

  describe(`Login`, () => {
    describe(`sunny`, () => {
      it(`can log in`, async () => {
        const { firstName, lastName, email } = getDefaultUser(data);
        const response = await tm.login(email, defaultPassword).expect(200);
        expect(response.body).toMatchObject({
          email,
          firstName,
          lastName,
        });
      });

      it(`does not send back password or passwordHash`, async () => {
        const { email } = getDefaultUser(data);
        const response = await tm.login(email, defaultPassword).expect(200);
        expect(response.body.password).toBeFalsy();
        expect(response.body.passwordHash).toBeFalsy();
      });

      it(`can perform a full login flow`, async () => {
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
    });
    describe(`rainy`, () => {
      it(`can't log in with the wrong password`, async () => {
        const { email } = getDefaultUser(data);
        await tm.login(email, `wrongpassword`).expect(401);
      });
      it(`can't log in with the wrong email`, async () => {
        await tm.login(`wrongemail@test.com`, defaultPassword).expect(401);
      });
      it(`can't log in with the wrong email and wrong password`, async () => {
        await tm.login(`wrongemail@test.com`, `wrongpassword`).expect(401);
      });
    });

    describe(`validations`, () => {
      it(`validates email`, async () => {
        await tm.login(null, defaultPassword).expect(400);
        await tm.login(undefined, defaultPassword).expect(400);
        await tm.login(0, defaultPassword).expect(400);
        await tm.login(1, defaultPassword).expect(400);
        await tm.login({ email: `lol` }, defaultPassword).expect(400);
        await tm.login({}, defaultPassword).expect(400);
        await tm.login(`bademail`, defaultPassword).expect(400);
        await tm.login(`bademail@`, defaultPassword).expect(400);
        await tm.login(`bademail.com`, defaultPassword).expect(400);
        await tm.login(`@bademail.com`, defaultPassword).expect(400);
        await tm.login(` @bademail.com`, defaultPassword).expect(400);
        await tm.login(`bademail@something`, defaultPassword).expect(400);
        await tm.login(` bademail@something`, defaultPassword).expect(400);
        await tm.login(`bademail@something `, defaultPassword).expect(400);
        await tm.login(`bademail `, defaultPassword).expect(400);
        await tm.login(`lol@bademail .com`, defaultPassword).expect(400);

        // capitals
        await tm.login(`UPPERCASE@EMAIL.COM`, defaultPassword).expect(400);
        await tm.login(`lowerCamel@email.com`, defaultPassword).expect(400);
        await tm.login(`UpperCamel@email.com`, defaultPassword).expect(400);
        await tm.login(`user@EMAIL.com`, defaultPassword).expect(400);
        await tm.login(`user@email.COM`, defaultPassword).expect(400);

        expect(sgMail.send).toHaveBeenCalledTimes(0);
      });

      it(`requires a password of at least 8 characters in length.`, async () => {
        const user = newUser;

        await tm.login(user.email, undefined).expect(400);
        await tm.login(user.email, null).expect(400);
        await tm.login(user.email, {}).expect(400);
        await tm.login(user.email, `lol`).expect(400);
        await tm.login(user.email, null).expect(400);
        await tm.login(user.email, ``).expect(400);
        await tm.login(user.email, `t`).expect(400);
        await tm.login(user.email, `to`).expect(400);
        await tm.login(user.email, `too`).expect(400);
        await tm.login(user.email, `toos`).expect(400);
        await tm.login(user.email, `toosh`).expect(400);
        await tm.login(user.email, `toosho`).expect(400);
        await tm.login(user.email, `tooshor`).expect(400);

        // the next one has the right length. but again, it's not a valid user email...
        // so we expect a 401 instead of a 400.
        await tm.login(user.email, `NOTshort`).expect(401);
      });
    });
  });
});
