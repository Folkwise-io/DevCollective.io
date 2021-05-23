import appFactory from "../appFactory";
import { queryGql } from "../test/gql";
import { Express } from "express";

describe("User object", () => {
  let app: Express;

  beforeAll(() => {
    app = appFactory();
  });

  describe("root user query", () => {
    it("can fetch all users", async (done) => {
      const response = await queryGql(app)(
        `
          {
            users {
              id
            }
          }
        `,
      );

      console.log(response.body);

      done();
    });
  });
});
