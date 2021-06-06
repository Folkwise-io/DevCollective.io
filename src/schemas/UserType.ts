import { getUserFieldById } from "../data/UserRepo";
import { getPostIdsForUserId } from "../data/PostRepo";

import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";

const userFieldHoc = (fieldName: string) => (id: number) => getUserFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "User",
  fields: () => {
    const PostType = require("./PostType").default;

    return {
      id: {
        type: GraphQLID,
        resolve: (id) => id,
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
    };
  },
});
