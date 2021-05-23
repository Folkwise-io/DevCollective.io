import express from "express";
import { graphqlHTTP, RequestInfo, OptionsData } from "express-graphql";
import schema from "./schemas";
import depthLimit from "graphql-depth-limit";

export default function appFactory() {
  const app = express();

  app.use(
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
