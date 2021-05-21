const fakeData = require("../db/fake-data");
const { getUserFieldById } = require("../db/user-db");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const userFieldHoc = (fieldName) => (id) => getUserFieldById(id, fieldName);

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => {
    const PostType = require("./PostType");

    return {
      id: {
        type: GraphQLString,
        resolve: (id) => id,
      },
      firstName: {
        type: GraphQLString,
        resolve: userFieldHoc("firstName"),
      },
      lastName: { type: GraphQLString, resolve: userFieldHoc("lastName") },
      createdAt: { type: GraphQLString, resolve: userFieldHoc("createdAt") },
      posts: {
        type: GraphQLList(PostType),
        resolve: ({ id }) => getPostIdsForUserId(id),
      },
    };
  },
});

module.exports = UserType;
