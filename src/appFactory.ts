import cookieSession from "cookie-session";
import express from "express";
import { OptionsData, graphqlHTTP } from "express-graphql";
import depthLimit from "graphql-depth-limit";

import authRouter from "./auth/authRouter";
import configProvider from "./configProvider";
import schema from "./schemas";

const { MB_SESSION_KEY, MB_ENABLE_GRAPHQL_LOGGER, MB_ENABLE_GRAPHIQL } = configProvider();

export default function appFactory() {
  const app = express();

  app.use(
    cookieSession({
      name: `mb-session`,
      keys: [MB_SESSION_KEY], // TODO: change
    }),
  );
  app.use(`/auth`, authRouter);

  const graphqlOptions: OptionsData = {
    schema,
    graphiql: MB_ENABLE_GRAPHIQL,
    validationRules: [depthLimit(3, { ignore: [] })],
  };

  graphqlOptions.customFormatErrorFn = (error) => {
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
  };

  app.use(`/graphql`, graphqlHTTP(graphqlOptions));

  return app;
}
