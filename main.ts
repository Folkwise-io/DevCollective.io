import express from "express";
import { graphqlHTTP } from "express-graphql";
import schema from "./schemas";

const app = express();

app.use(
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(8080, () => console.log("Started on port 8080"));
