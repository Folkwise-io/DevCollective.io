import appFactory from "../appFactory";
import request from "supertest";

describe("", () => {
  it("", async (done) => {
    const app = appFactory();
    const response = await request(app)
      .post("/")
      .set("Accept", "application/json")
      .set("Content-Type", "application/graphql")
      .send(
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
