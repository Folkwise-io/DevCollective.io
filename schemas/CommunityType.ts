import { getCommunityFieldById } from "../db/community-db";
import { getPostIdsForCommunityId } from "../db/post-db";

import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

const communityFieldHoc = (fieldName: string) => (id: string) =>
  getCommunityFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "Community",
  fields: () => {
    const PostType = require("./PostType").default;
    const UserType = require("./UserType").default;

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
        resolve: (id) => getPostIdsForCommunityId(id),
      },
    };
  },
});
