import request from "supertest";

export type MbQueryAgent = ReturnType<typeof query>;
const query = (app: Express.Application) => {
  const agent = request.agent(app);

  return {
    gql: (query: string, variables?: any) => {
      const postData = {
        query,
        variables,
      };
      return (
        agent
          .post("/graphql")
          .set("Accept", "application/json")
          // .set("Content-Type", "application/graphql")
          .send(postData)
      );
    },
    post: (route: string, payload?: any) => {
      let x = agent.post(route).set("Accept", "application/json").set("Content-Type", "application/json").send(payload);

      if (payload) {
        x = x.set("Content-Type", "application/json").send(payload);
      } else {
        x = x.send();
      }

      return x;
    },
    get: (route: string) => {
      return agent.post(route).set("Accept", "application/json").send();
    },
  };
};

export default query;
