import { getCommunityFieldById } from "../data/CommunityRepo";
import { getPostIdsForCommunityId } from "../data/PostRepo";

import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLID } from "graphql";

const communityFieldHoc = (fieldName: string) => (id: number) => getCommunityFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "Community",
  fields: () => {
    const PostType = require("./PostType").default;
    const UserType = require("./UserType").default;

    return {
      id: {
        type: GraphQLID,
        resolve: (id: string) => id,
      },
      title: {
        type: GraphQLString,
        resolve: communityFieldHoc("title"),
      },
      callsign: {
        type: GraphQLString,
        resolve: communityFieldHoc("callsign"),
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
