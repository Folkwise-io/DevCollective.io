import request from "supertest";

export type MbQueryAgent = ReturnType<typeof query>;
const query = (app: Express.Application) => {
  const agent = request.agent(app);

  return {
    gqlQuery: (query: string, variables?: any) => {
      const postData = {
        query,
        variables,
      };
      return agent.post("/graphql").set("Accept", "application/json").send(postData);
    },
    gqlMutation: (mutation: string, variables?: any) => {
      const postData = {
        query: mutation,
        variables,
      };
      return agent.post("/graphql").set("Accept", "application/json").send(postData);
    },
    post: (route: string, payload?: any) => {
      let request = agent
        .post(route)
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .send(payload);

      if (payload) {
        request = request.set("Content-Type", "application/json").send(payload);
      } else {
        request = request.send();
      }

      return request;
    },
    get: (route: string, query?: any) => {
      return agent.get(route).query(query).set("Accept", "application/json").send();
    },
  };
};

export default query;
