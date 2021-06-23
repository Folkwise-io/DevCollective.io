import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { getCommentIdsForUserId } from "../data/CommentRepo";
import { getPostIdsForUserId } from "../data/PostRepo";
import { getUserFieldById } from "../data/UserRepo";
import CommentType from "./CommentType";
import PostType from "./PostType";

const userFieldHoc = (fieldName: string) => (id: string) => getUserFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: `User`,
  fields: () => {
    return {
      id: {
        type: GraphQLID,
        resolve: (id: string) => id,
      },
      firstName: {
        type: GraphQLString,
        resolve: userFieldHoc(`firstName`),
      },
      lastName: { type: GraphQLString, resolve: userFieldHoc(`lastName`) },
      createdAt: { type: GraphQLString, resolve: userFieldHoc(`createdAt`) },
      updatedAt: { type: GraphQLString, resolve: userFieldHoc(`updatedAt`) },
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
