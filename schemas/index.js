const fakeData = require("./fake-data");

const {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  isRequiredArgument,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");

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

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: {
      type: GraphQLList(UserType),
      resolve: () => {
        return fakeData.users;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: QueryType });

module.exports = schema;
