const fakeData = require("./fake-data");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const PostType = require("./PostType");
const UserType = require("./UserType");

const CommunityType = new GraphQLObjectType({
  name: "Community",
  fields: {
    id: { type: GraphQLString },
    title: {
      type: GraphQLString,
    },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    createdBy: {
      type: GraphQLList(UserType),
      resolve: ({ id }) => {
        return fakeData.users.find((u) => u.id === id).id;
      },
    },
    posts: {
      type: GraphQLList(PostType),
      resolve: ({ id }) => {
        return fakeData.posts
          .filter((p) => p.createdBy === id)
          .map((x) => x.id);
      },
    },
  },
});

module.exports = CommunityType;
