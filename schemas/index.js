const { GraphQLSchema } = require("graphql");

const QueryType = require("./QueryType");

const schema = new GraphQLSchema({ query: QueryType });

module.exports = schema;
