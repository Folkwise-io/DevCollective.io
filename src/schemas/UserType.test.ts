import appFactory from "../appFactory";
import { queryGql } from "../test/gql";

describe("User Type", () => {
  beforeAll(() => {
    const app = appFactory();
  });

  it("", async (done) => {
    const app = appFactory();
    const response = await queryGql(app)(
      `
        {
          users {
            id
          }
        }
      `
    );

    console.log(response.body);

    done();
  });
});
