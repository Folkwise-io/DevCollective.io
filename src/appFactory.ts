import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schemas";

export default function appFactory() {
  const app = express();

  app.use(
    graphqlHTTP({
      schema,
      graphiql: true,
    }),
  );

  return app;
}
