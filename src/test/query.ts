import request from "supertest";

const query = (app: Express.Application) => ({
  gql: (query: string) => {
    return request(app)
      .post("/graphql")
      .set("Accept", "application/json")
      .set("Content-Type", "application/graphql")
      .send(query);
  },
  post: (route: string, payload: any) => {
    return request(app)
      .post(route)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(payload);
  },
});

export default query;
