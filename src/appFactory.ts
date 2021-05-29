import express from "express";
import { graphqlHTTP, RequestInfo, OptionsData } from "express-graphql";
import schema from "./schemas";
import depthLimit from "graphql-depth-limit";
import authRouter from "./auth/authRouter";
import cookieSession from "cookie-session";
import { config } from "dotenv";

import configProvider from "./configProvider";

const { MB_SESSION_KEY, MB_ENABLE_GRAPHQL_LOGGER, MB_ENABLE_GRAPHIQL } = configProvider();

export default function appFactory() {
  const app = express();

  app.use(
    cookieSession({
      name: "mb-session",
      keys: [MB_SESSION_KEY], // TODO: change
    }),
  );
  app.use("/auth", authRouter);

  const graphqlOptions: OptionsData = {
    schema,
    graphiql: MB_ENABLE_GRAPHIQL,
    validationRules: [depthLimit(3, { ignore: [] })],
  };

  graphqlOptions.customFormatErrorFn = (error) => {
    if (error.stack && MB_ENABLE_GRAPHQL_LOGGER) {
      console.error("GraphQL Error:", error.stack);
    }
    return {
      message: error.message,
      // @ts-ignore
      extensions: error?.extensions,
      locations: error.locations,
      stack: error.stack ? error.stack.split("\n") : [],
      path: error.path,
    };
  };

  app.use("/graphql", graphqlHTTP(graphqlOptions));

  return app;
}
