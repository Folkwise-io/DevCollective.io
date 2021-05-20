const fakeData = require("./fake-data");

const { GraphQLObjectType, GraphQLList } = require("graphql");

const UserType = require("./UserType");
const CommunityType = require("./CommunityType");

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: GraphQLList(UserType),
      resolve: () => {
        return fakeData.users;
      },
    },
    communities: {
      type: GraphQLList(CommunityType),
      resolve: () => {
        return fakeData.communities;
      },
    },
  },
});

module.exports = QueryType;
