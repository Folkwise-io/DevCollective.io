import { getUserFieldById } from "../db/user-db";
import { getPostIdsForUserId } from "../db/post-db";

import { GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";

const userFieldHoc = (fieldName: string) => (id: string) =>
  getUserFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "User",
  fields: () => {
    const PostType = require("./PostType").default;

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
        resolve: (id) => getPostIdsForUserId(id),
      },
    };
  },
});
