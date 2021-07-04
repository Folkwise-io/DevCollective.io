import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

import { getCommentFieldById } from "../data/CommentRepo";
import { PostType } from "./PostType";
import { UserType } from "./UserType";

const commentFieldHoc = (fieldName: string) => (id: string) => getCommentFieldById(id, fieldName);

export const CommentType: GraphQLObjectType = new GraphQLObjectType({
  name: `Comment`,
  fields: () => ({
    id: {
      type: GraphQLID,
      resolve: (id: string) => id,
    },
    body: {
      type: GraphQLString,
      resolve: commentFieldHoc(`body`),
    },
    createdAt: {
      type: GraphQLString,
      resolve: commentFieldHoc(`createdAt`),
    },
    post: {
      type: PostType,
      resolve: commentFieldHoc(`postId`),
    },
    parentComment: {
      type: CommentType,
      resolve: commentFieldHoc(`parentCommentId`),
    },
    author: {
      type: UserType,
      resolve: commentFieldHoc(`authorId`),
    },
  }),
});
