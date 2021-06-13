import { getUserFieldById } from "../data/UserRepo";
import { getPostIdsForUserId } from "../data/PostRepo";

import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import { getCommentIdsForUserId } from "../data/CommentRepo";

const userFieldHoc = (fieldName: string) => (id: string) => getUserFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "User",
  fields: () => {
    const PostType = require("./PostType").default;
    const CommentType = require("./CommentType").default;

    return {
      id: {
        type: GraphQLID,
        resolve: (id: string) => id,
      },
      firstName: {
        type: GraphQLString,
        resolve: userFieldHoc("firstName"),
      },
      lastName: { type: GraphQLString, resolve: userFieldHoc("lastName") },
      createdAt: { type: GraphQLString, resolve: userFieldHoc("createdAt") },
      updatedAt: { type: GraphQLString, resolve: userFieldHoc("updatedAt") },
      posts: {
        type: GraphQLList(PostType),
        resolve: (id) => getPostIdsForUserId(id),
      },
      comments: {
        type: GraphQLList(CommentType),
        resolve: (id) => getCommentIdsForUserId(id),
      },
    };
  },
});
