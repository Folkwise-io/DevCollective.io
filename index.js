const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const fs = require("fs");
const path = require("path");

const schemaFile = fs.readFileSync(
  path.resolve(__dirname, "schema.graphql"),
  "utf-8"
);

const app = express();

const schema = buildSchema(schemaFile);

const rootValue = {
  books: [
    {
      title: "Lord of the Rings",
      author: "JRR Tolkien",
    },
    {
      title: "Dune",
      author: "Frank Herbert",
    },
  ],
};

app.use(
  graphqlHTTP({
    schema,
    rootValue,
  })
);

app.listen(8080, () => console.log("Started on port 8080"));
