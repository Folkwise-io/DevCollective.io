const fakeData = require("./fake-data");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    const PostType = require("./PostType");

    return {
      id: {
        type: GraphQLString,
      },
      firstName: {
        type: GraphQLString,
      },
      lastName: { type: GraphQLString },
      createdAt: { type: GraphQLString },
      posts: {
        type: GraphQLList(PostType),
        resolve: ({ id }) => {
          return fakeData.posts.filter((p) => p.createdBy === id);
          // .map((x) => x.id);
        },
      },
    };
  },
});

module.exports = UserType;
