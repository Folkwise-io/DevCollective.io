const fakeData = require("../db/fake-data");
const { getCommunityFieldById } = require("../db/community-db");

const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");

const communityFieldHoc = (fieldName) => (id) =>
  getCommunityFieldById(id, fieldName);

const CommunityType = new GraphQLObjectType({
  name: "Community",
  fields: () => {
    const PostType = require("./PostType");
    const UserType = require("./UserType");

    return {
      id: {
        type: GraphQLString,
        resolve: (id) => id,
      },
      title: {
        type: GraphQLString,
        resolve: communityFieldHoc("title"),
      },
      description: {
        type: GraphQLString,
        resolve: communityFieldHoc("description"),
      },
      createdAt: {
        type: GraphQLString,
        resolve: communityFieldHoc("createdAt"),
      },
      createdBy: {
        type: UserType,
        resolve: communityFieldHoc("createdBy"),
      },
      posts: {
        type: GraphQLList(PostType),
        resolve: ({ id }) => getPostIdsForCommunityId(id),
      },
    };
  },
});

module.exports = CommunityType;
