import DataLoader from "dataloader";
import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

import { getAllCommunityIds, getCommunityIdByCallsign } from "../data/CommunityRepo";
import { getKnex } from "../data/knexProvider";
import { getAllPostIds } from "../data/PostRepo";
import { getAllUserIds } from "../data/UserRepo";
import { CommunityType } from "./CommunityType";
import { PostType } from "./PostType";
import { UserType } from "./UserType";

export const RootQuery = new GraphQLObjectType({
  name: `Query`,
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (obj, args, context, info) => {
        context.loader.user = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`users`).whereIn(`id`, ids);
        });

        return args.id;
      },
    },
    users: {
      type: GraphQLList(UserType),
      resolve: (obj, args, context, info) => {
        context.loader.user = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`users`).whereIn(`id`, ids);
        });

        return getAllUserIds();
      },
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
      resolve: (obj, args, context, info) => {
        const { id, callsign } = args;
        context.loader.community = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`communities`).whereIn(`id`, ids);
        });

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
      resolve: (obj, args, context, info) => {
        context.loader.community = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`communities`).whereIn(`id`, ids);
        });

        return getAllCommunityIds();
      },
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
      resolve: (obj, args, context, info) => {
        context.loader.post = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`posts`).whereIn(`id`, ids);
        });

        return args.id;
      },
    },
    posts: {
      type: GraphQLList(PostType),
      resolve: (obj, args, context, info) => {
        context.loader.post = new DataLoader<number, DUser>(async (ids) => {
          const knex = await getKnex();
          return knex(`posts`).whereIn(`id`, ids);
        });

        return getAllPostIds();
      },
    },
  },
});
