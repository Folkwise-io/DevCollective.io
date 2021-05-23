import appFactory from "../appFactory";
import { queryGql } from "../test/gql";

describe("User object", () => {
  let app;

  beforeAll(() => {
    app = appFactory();
  });

  describe("root user query", () => {
    it("can fetch all users", async (done) => {
      const app = appFactory();
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
