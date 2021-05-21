const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require("graphql");
const userDb = require("../db/user-db");

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => {
    const UserType = require("./UserType");
    const fakeData = require("../db/fake-data");

    return {
      id: { type: GraphQLString },
      title: { type: GraphQLString, resolve: ({ id }) => userDb.list("title") }, // TODO: Gotta find a better pattern for these kinds of queries
      commentCount: { type: GraphQLInt },
      upvoteCount: { type: GraphQLInt },
      createdAt: { type: GraphQLString },
      author: {
        type: UserType,
        resolve: ({ author }) => {
          userDb.list("id").then();
          return fakeData.users.find((u) => u.id === author).id;
        },
      },
    };
  },
});

module.exports = PostType;
