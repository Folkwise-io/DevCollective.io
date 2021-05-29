import { GraphQLObjectType, GraphQLList, GraphQLString } from "graphql";
import { getAllUserIds } from "../data/UserRepo";
import { getAllCommunityIds, getCommunityIdByCallsign } from "../data/CommunityRepo";
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
      community: {
        type: CommunityType,
        args: {
          id: {
            type: GraphQLString,
          },
          callsign: {
            type: GraphQLString,
          },
        },
        resolve: (_, args) => {
          const { id, callsign } = args;

          // XOR
          if (id && callsign) {
            throw new Error("Cannot query Community by both id and callsign.");
          } else if (!id && !callsign) {
            const e = new Error("Must query Community by either id or callsign, but neither was provided.");
            // @ts-ignore
            e.extensions = {
              errorCode: 1000,
            };
            throw e;
          }

          // id case
          if (id) {
            return id;
          }

          // callsign case
          return getCommunityIdByCallsign(callsign);
        },
      },
      communities: {
        type: GraphQLList(CommunityType),
        resolve: () => getAllCommunityIds(),
      },
      post: {
        type: PostType,
        args: {
          id: {
            type: GraphQLString,
          },
          callsign: {
            type: GraphQLString,
          },
        },
        resolve: (_, args) => args.id,
      },
      posts: {
        type: GraphQLList(PostType),
        resolve: () => getAllPostIds(),
      },
    };
  },
});
