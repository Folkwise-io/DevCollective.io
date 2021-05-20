const fakeData = require("./fake-data");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const PostType = require("./PostType");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: {
      type: GraphQLString,
    },
    lastName: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    posts: {
      type: GraphQLList(PostType),
      resolve: ({ id }) => {
        return fakeData.posts.filter((p) => p.createdBy === id);
      },
    },
  },
});

module.exports = UserType;
