const fakeData = require("../db/fake-data");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const CommunityType = new GraphQLObjectType({
  name: "Community",
  fields: () => {
    const PostType = require("./PostType");
    const UserType = require("./UserType");

    return {
      id: { type: GraphQLString },
      title: {
        type: GraphQLString,
      },
      description: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      createdBy: {
        type: UserType,
        resolve: ({ createdBy }) => {
          return fakeData.users.find((u) => u.id === createdBy);
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
    };
  },
});

module.exports = CommunityType;
