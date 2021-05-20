const { GraphQLInt, GraphQLObjectType, GraphQLString } = require("graphql");

const PostType = new GraphQLObjectType({
  name: "Post",
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    commentCount: { type: GraphQLInt },
    upvoteCount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  },
});

module.exports = PostType;
