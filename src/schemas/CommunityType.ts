import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { getCommunityFieldById } from "../data/CommunityRepo";
import { getPostIdsForCommunityId } from "../data/PostRepo";
import { PostType } from "./PostType";
import { UserType } from "./UserType";

const communityFieldHoc = (fieldName: string) => (id: string) => getCommunityFieldById(id, fieldName);

export const CommunityType = new GraphQLObjectType({
  name: `Community`,
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (id: string) => id,
    },
    title: {
      type: GraphQLString,
      resolve: communityFieldHoc(`title`),
    },
    callsign: {
      type: GraphQLString,
      resolve: communityFieldHoc(`callsign`),
    },
    description: {
      type: GraphQLString,
      resolve: communityFieldHoc(`description`),
    },
    createdAt: {
      type: GraphQLString,
      resolve: communityFieldHoc(`createdAt`),
    },
    createdBy: {
      type: UserType,
      resolve: communityFieldHoc(`createdBy`),
    },
    posts: {
      type: GraphQLList(PostType),
      resolve: (id) => getPostIdsForCommunityId(id),
    },
  }),
});
