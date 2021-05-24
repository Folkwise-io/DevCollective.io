import express from "express";
import { graphqlHTTP, RequestInfo, OptionsData } from "express-graphql";
import schema from "./schemas";
import depthLimit from "graphql-depth-limit";
import authRouter from "./auth/authRouter";
import cookieSession from "cookie-session";
import { config } from "dotenv";

import configProvider from "./configProvider";

const { MB_SESSION_KEY } = configProvider();

export default function appFactory() {
  const app = express();

  app.use(
    cookieSession({
      name: "mb-session",
      keys: [MB_SESSION_KEY], // TODO: change
    }),
  );
  app.use("/auth", authRouter);

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
      validationRules: [depthLimit(3, { ignore: [] })],
      customFormatErrorFn: (error) => {
        if (error.stack) {
          console.error("GraphQL Error:", error.stack);
        }
        return {
          message: error.message,
          locations: error.locations,
          stack: error.stack ? error.stack.split("\n") : [],
          path: error.path,
        };
      },
    }),
  );

  return app;
}
