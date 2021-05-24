import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { dataset_oneUser, user } from "../../dev/test/datasets/dataset-one-user";

describe("User object", () => {
  let app: Express;

  beforeAll(async () => {
    app = appFactory();
  });

  beforeEach(async () => {
    await dataset_oneUser();
  });

  describe("root user query", () => {
    it("can fetch one users", async () => {
      const response = await query(app).gql(
        `
          {
            users {
              firstName,
              lastName
            }
          }
        `,
      );

      expect(response.body.data).toMatchObject({
        users: [{ firstName: user.firstName, lastName: user.lastName }],
      });
    });
  });
});
