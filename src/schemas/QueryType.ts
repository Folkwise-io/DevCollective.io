import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { getAllCommunityIds, getCommunityIdByCallsign } from "../data/CommunityRepo";
import { getAllPostIds } from "../data/PostRepo";
import { getAllUserIds } from "../data/UserRepo";
import CommunityType from "./CommunityType";
import PostType from "./PostType";
import UserType from "./UserType";

export default new GraphQLObjectType({
  name: `Query`,
  fields: () => {
    return {
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLID,
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
            type: GraphQLID,
          },
          callsign: {
            type: GraphQLString,
          },
        },
        resolve: (_, args) => {
          const { id, callsign } = args;

          // XOR
          if (id && callsign) {
            throw new Error(`Cannot query Community by both id and callsign.`);
          } else if (!id && !callsign) {
            const e = new Error(`Must query Community by either id or callsign, but neither was provided.`);
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
            type: GraphQLID,
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
