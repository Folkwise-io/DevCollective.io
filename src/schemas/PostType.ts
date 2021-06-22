import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import slugify from "slugify";

import { getCommentIdsForPostId } from "../data/CommentRepo";
import { getCommunityFieldById } from "../data/CommunityRepo";
import { getPostById, getPostFieldById } from "../data/PostRepo";
import CommentType from "./CommentType";
import CommunityType from "./CommunityType";
import UserType from "./UserType";

const postFieldHoc = (fieldName: string) => (id: string) => getPostFieldById(id, fieldName);

const PostType: any = new GraphQLObjectType({
  name: `Post`,
  fields: () => {
    return {
      id: {
        type: GraphQLID,
        resolve: (id: string) => id,
      },
      title: {
        type: GraphQLString,
        resolve: postFieldHoc(`title`),
      },
      body: {
        type: GraphQLString,
        resolve: postFieldHoc(`body`),
      },
      url: {
        type: GraphQLString,
        resolve: async (id: string) => {
          const post = await getPostById(id);
          const { title, communityId } = post;
          // TODO: Straighten up types so that "" + is not required
          const callsign = await getCommunityFieldById(`` + communityId, `callsign`);
          const slug = slugify(title, {
            lower: true,
            strict: true,
          });
          return `/c/${callsign}/${id}-${slug}`;
        },
      },
      createdAt: {
        type: GraphQLString,
        resolve: postFieldHoc(`createdAt`),
      },
      author: {
        type: UserType,
        resolve: postFieldHoc(`authorId`),
      },
      community: {
        type: CommunityType,
        resolve: postFieldHoc(`communityId`),
      },
      comments: {
        type: GraphQLList(CommentType),
        resolve: async (id: string) => getCommentIdsForPostId(id),
      },
    };
  },
});

export default PostType;
