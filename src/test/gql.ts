import request from "supertest";

export const queryGql = (app: Express.Application) => (query: string) => {
  return request(app)
    .post("/")
    .set("Accept", "application/json")
    .set("Content-Type", "application/graphql")
    .send(query);
};
