const { GraphQLObjectType, GraphQLList } = require("graphql");
const { getAllUserIds } = require("../db/user-db");
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
        resolve: () => getAllUserIds(),
      },
      communities: {
        type: GraphQLList(CommunityType),
        resolve: () => communityDb.list(),
      },
      posts: {
        type: GraphQLList(PostType),
        resolve: () => postDb.list(),
      },
    };
  },
});

module.exports = QueryType;
