import { GraphQLObjectType, GraphQLList } from "graphql";
import { getAllUserIds } from "../data/UserRepo";
import { getAllCommunityIds } from "../data/CommunityRepo";
import { getAllPostIds } from "../data/PostRepo";

export default new GraphQLObjectType({
  name: "Query",
  fields: () => {
    const UserType = require("./UserType").default;
    const CommunityType = require("./CommunityType").default;
    const PostType = require("./PostType").default;

    return {
      users: {
        type: GraphQLList(UserType),
        resolve: () => getAllUserIds(),
      },
      communities: {
        type: GraphQLList(CommunityType),
        resolve: () => getAllCommunityIds(),
      },
      posts: {
        type: GraphQLList(PostType),
        resolve: () => getAllPostIds(),
      },
    };
  },
});
