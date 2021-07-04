import "reflect-metadata";

import cookieSession from "cookie-session";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import depthLimit from "graphql-depth-limit";
import { buildSchema } from "type-graphql";

import configProvider from "./configProvider";
import { UserResolver } from "./graphql/user/user.resolver";

const { MB_ENABLE_GRAPHIQL, MB_SESSION_KEY, PORT } = configProvider();

(async () => {
  const app = express();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  app.use(
    cookieSession({
      name: `mb-session`,
      keys: [MB_SESSION_KEY], // TODO: change
    }),
  );

  app.use(
    `/graphql`,
    graphqlHTTP({
      schema,
      graphiql: MB_ENABLE_GRAPHIQL,
      validationRules: [depthLimit(10)],
    }),
  );

  app.listen(PORT, () => {
    console.info(`API started on port ${PORT}. GraphiQL is available at /graphql/graphiql.`);
  });
})();
