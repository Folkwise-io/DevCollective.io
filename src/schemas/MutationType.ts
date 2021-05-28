import e from "express";
import { GraphQLObjectType, GraphQLString } from "graphql";
import { getCommunityIdByCallsign, getCommunityFieldById } from "../data/CommunityRepo";
import { createCommunityUser, getCommunityUser } from "../data/CommunityUserRepo";
import { getUserById, getUserFieldById } from "../data/UserRepo";

// const {movieType} = require('./types.js');
// const {inputMovieType} = require('./inputtypes.js');
// let {movies} = require('./data.js');

import CommunityType from "./CommunityType";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    joinCommunity: {
      type: CommunityType,
      args: {
        userId: {
          type: GraphQLString,
        },
        communityCallsign: {
          type: GraphQLString,
        },
      },
      resolve: async function (source, args, context) {
        // TODO: Simplify
        const { communityCallsign, userId } = args;
        const communityId = await getCommunityIdByCallsign(communityCallsign);
        const user = await getUserById(userId);

        if (!user) {
          return null;
        }

        if (!communityId) {
          return null;
        }

        let communityUser = await getCommunityUser({ userId: user.id, communityId });
        if (communityUser) {
          return communityUser.communityId;
        } else {
          const result: any = await createCommunityUser({ userId: user.id, communityId });
          if (result.rowCount === 1) {
            return communityId;
          } else {
            return null;
          }
        }
      },
    },
  },
});

export default MutationType;
