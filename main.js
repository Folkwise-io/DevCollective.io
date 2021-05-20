const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schemas");
// const resolvers = require("./resolvers");

const app = express();

app.use(
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(8080, () => console.log("Started on port 8080"));
