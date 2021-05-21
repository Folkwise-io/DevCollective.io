const { GraphQLObjectType, GraphQLList } = require("graphql");
const userDb = require("../db/user-db");
const communityDb = require("../db/community-db");
const postDb = require("../db/post-db");

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: () => {
    const UserType = require("./UserType");
    const CommunityType = require("./CommunityType");
    const PostType = require("./PostType");

    return {
      users: {
        type: GraphQLList(UserType),
        resolve: () => userDb.list("id"),
      },
      communities: {
        type: GraphQLList(CommunityType),
        resolve: () => communityDb.list("id"),
      },
      posts: {
        type: GraphQLList(PostType),
        resolve: () => postDb.list("id"),
      },
    };
  },
});

module.exports = QueryType;
