const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schemas = require("./schemas");
const resolvers = require("./resolvers");

const app = express();

app.use(
  graphqlHTTP({
    schema: schemas,
    rootValue: resolvers,
  })
);

app.listen(8080, () => console.log("Started on port 8080"));
