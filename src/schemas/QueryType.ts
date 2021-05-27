import { GraphQLObjectType, GraphQLList, GraphQLString } from "graphql";
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
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLString,
          },
        },
        resolve: (_, args) => {
          return args.id;
        },
      },
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