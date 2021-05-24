import express from "express";
import { graphqlHTTP, RequestInfo, OptionsData } from "express-graphql";
import schema from "./schemas";
import depthLimit from "graphql-depth-limit";
import configurePassport from "./auth/configurePassport";
import authRouter from "./auth/authRouter";
import { initialize, session } from "passport";

export default function appFactory() {
  configurePassport();

  const app = express();

  app.use(initialize());
  app.use(session());

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
