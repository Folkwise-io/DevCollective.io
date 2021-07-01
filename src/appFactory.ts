import "reflect-metadata";

import cookieSession from "cookie-session";
import express from "express";
import { OptionsData, graphqlHTTP } from "express-graphql";
import depthLimit from "graphql-depth-limit";
import { buildSchema } from "type-graphql";

import authRouter from "./auth/authRouter";
import configProvider from "./configProvider";
import { UserResolver } from "./resolvers/user.resolver";

const { MB_SESSION_KEY, MB_ENABLE_GRAPHQL_LOGGER, MB_ENABLE_GRAPHIQL } = configProvider();

export default async function appFactory() {
  const app = express();

  app.use(
    cookieSession({
      name: `mb-session`,
      keys: [MB_SESSION_KEY], // TODO: change
    }),
  );
  app.use(`/auth`, authRouter);

  const graphqlOptions: OptionsData = {
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    graphiql: MB_ENABLE_GRAPHIQL,
    validationRules: [depthLimit(3, { ignore: [] })],
    customFormatErrorFn: (error) => {
      if (error.stack && MB_ENABLE_GRAPHQL_LOGGER) {
        console.error(`GraphQL Error:`, error.stack);
      }
      return {
        message: error.message,
        extensions: error?.extensions,
        locations: error.locations,
        stack: error.stack ? error.stack.split(`\n`) : [],
        path: error.path,
      };
    },
  };

  app.use(`/graphql`, graphqlHTTP(graphqlOptions));

  return app;
}
