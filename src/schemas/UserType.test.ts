import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";

describe("User object", () => {
  let app: Express;

  beforeAll(() => {
    app = appFactory();
  });

  describe("root user query", () => {
    it("can fetch all users", async (done) => {
      const response = await query(app).gql(
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
