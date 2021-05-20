const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} = require("graphql");

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: () => {
    const UserType = require("./UserType");
    const fakeData = require("./fake-data");

    return {
      id: { type: GraphQLString },
      title: { type: GraphQLString },
      commentCount: { type: GraphQLInt },
      upvoteCount: { type: GraphQLInt },
      createdAt: { type: GraphQLString },
      author: {
        type: UserType,
        resolve: ({ author }) => {
          return fakeData.users.find((u) => u.id === author).id;
        },
      },
    };
  },
});

module.exports = PostType;
