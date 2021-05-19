const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const app = express();

const schema = buildSchema(`
  type Book {
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
  }
`);

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
