import appFactory from "../appFactory";
import { Express } from "express";
import TestManager from "../test/TestManager";
import { PromiseValue } from "type-fest";
import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import { createUser } from "../service/UserService";
import { getUserByEmail, updateUser } from "../data/UserRepo";
import { v4 } from "uuid";
import bcrypt from "bcrypt";

describe("Account Confirmation", () => {
  let tm: TestManager;
  let app: Express;
  let data: PromiseValue<ReturnType<typeof datasetLoader>>;

  const carlJung = {
    firstName: "Carl",
    lastName: "Jung",
    email: "carl.jung@gmai.com",
    password: "password",
  };

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

  describe("sunny cases", () => {
    test("When I create an account, accountConfirmed is false.", async () => {
      // register carl jung
      {
        // use a fork to prevent cookie contamination
        const tmFork = tm.fork();
        const response = await tmFork.register(carlJung).expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(false);
      }

      // login as carl jung
      {
        const response = await tm.login(carlJung.email, carlJung.password).expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(false);
      }

      // check session as carl jung
      {
        const response = await tm.check().expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(false);
      }
    });

    test("After I confirm an account, accountConfirmed is true.", async () => {
      const wellKnownToken = v4();

      // register as carl jung
      {
        const tmFork = tm.fork();
        const response = await tmFork.register(carlJung).expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(false);
      }

      // set a hashed well known token in the database
      {
        const confirmationTokenHash = await bcrypt.hash(wellKnownToken, 10);
        const retrieved = await getUserByEmail(carlJung.email);
        await updateUser(retrieved.id, {
          confirmationTokenHash,
        });
      }

      // confirm the account
      {
        await tm
          .submitAccountConfirmationToken({
            confirmationToken: wellKnownToken,
            email: carlJung.email,
          })
          .expect(200);
      }

      // login as carl jung
      {
        const response = await tm.login(carlJung.email, carlJung.password).expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(true);
      }

      // login as carl jung
      {
        const response = await tm.check().expect(200);
        expect(response.body.accountConfirmed).toStrictEqual(true);
      }
    });
  });

  // describe("edge cases", () => {
  //   test("user resolver does not return confirmationToken or confirmationTokenHash", async () => {
  //     // can retrieve user
  //     {
  //       const response = await tm.gql(`
  //         query Query($id: String!) {
  //           user(id: $id) {
  //             email
  //           }
  //         }
  //       `).expect(200);

  //       expect(response.body).toBe
  //     }

  //     // cannot get accountConfirmation
  //     {

  //     }
  //   })
  // })
});
