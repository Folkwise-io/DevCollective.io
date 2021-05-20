const fakeData = require("./fake-data");

const { GraphQLObjectType, GraphQLList } = require("graphql");

const UserType = require("./UserType");

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: GraphQLList(UserType),
      resolve: () => {
        return fakeData.users;
      },
    },
  },
});

module.exports = QueryType;
