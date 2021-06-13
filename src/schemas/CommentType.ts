import { getCommentFieldById } from "../data/CommentRepo";

import { GraphQLObjectType, GraphQLString, GraphQLID } from "graphql";

const commentFieldHoc = (fieldName: string) => (id: string) => getCommentFieldById(id, fieldName);

const CommentType: GraphQLObjectType = new GraphQLObjectType({
  name: "Comment",
  fields: () => {
    const PostType = require("./PostType").default;
    const UserType = require("./UserType").default;

    return {
      id: {
        type: GraphQLID,
        resolve: (id: string) => id,
      },
      body: {
        type: GraphQLString,
        resolve: commentFieldHoc("body"),
      },
      createdAt: {
        type: GraphQLString,
        resolve: commentFieldHoc("createdAt"),
      },
      post: {
        type: PostType,
        resolve: commentFieldHoc("postId"),
      },
      parentComment: {
        type: CommentType,
        resolve: commentFieldHoc("parentCommentId"),
      },
      author: {
        type: UserType,
        resolve: commentFieldHoc("authorId"),
      },
    };
  },
});

export default CommentType;
