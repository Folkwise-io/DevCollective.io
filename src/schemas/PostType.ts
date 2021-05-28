import { GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLList } from "graphql";
import { getPostFieldById } from "../data/PostRepo";

const postFieldHoc = (fieldName: string) => (id: string) => getPostFieldById(id, fieldName);

export default new GraphQLObjectType({
  name: "Post",
  fields: () => {
    const UserType = require("./UserType").default;
    const CommunityType = require("./CommunityType").default;

    return {
      id: {
        type: GraphQLString,
        resolve: (id) => id,
      },
      title: {
        type: GraphQLString,
        resolve: postFieldHoc("title"),
      },
      body: {
        type: GraphQLString,
        resolve: postFieldHoc("body"),
      },
      createdAt: {
        type: GraphQLString,
        resolve: postFieldHoc("createdAt"),
      },
      author: {
        type: UserType,
        resolve: postFieldHoc("authorId"),
      },
      community: {
        type: CommunityType,
        resolve: postFieldHoc("communityId"),
      },
    };
  },
});
