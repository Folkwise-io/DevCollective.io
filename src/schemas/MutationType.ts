import { GraphQLObjectType, GraphQLString } from "graphql";
import { getCommunityFieldById } from "../data/CommunityRepo";
import { createCommunityUser, getCommunityUser } from "../data/CommunityUserRepo";

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
        communityId: {
          type: GraphQLString,
        },
      },
      resolve: async function (source, args, context) {
        const { communityId, userId } = args;
        return args.communityId;
        // const { communityId } = args;
        // const { userId } = context;

        // const community = await getCommunityFieldById(communityId, "id");

        // if (!community) {}

        // const communityUser = await getCommunityUser({ userId, communityId });

        // if (!communityUser) {
        //   createCommunityUser({ communityId, userId });
        // }

        // return communityUser.communityId;

        // movies.push(movie);

        // return _.find(movies, { id: args.input.id });
      },
    },
  },
});

export default MutationType;
