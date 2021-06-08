import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { getCommunityIdByCallsign, getCommunityFieldById } from "../data/CommunityRepo";
import { createCommunityUser, getCommunityUser } from "../data/CommunityUserRepo";
import { getUserById, getUserFieldById } from "../data/UserRepo";
import { createPost, getPostById } from "../data/PostRepo";

// const {movieType} = require('./types.js');
// const {inputMovieType} = require('./inputtypes.js');
// let {movies} = require('./data.js');

import CommunityType from "./CommunityType";
import PostType from "./PostType";
import CommentType from "./CommentType";
import { createComment } from "../data/CommentRepo";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createPost: {
      type: PostType,
      args: {
        title: {
          type: GraphQLString,
        },
        body: {
          type: GraphQLString,
        },
        communityCallsign: {
          type: GraphQLString,
        },
        authorId: {
          type: GraphQLID,
        },
      },
      resolve: async function (source, args, context) {
        const { body, title, communityCallsign, authorId } = args;
        const communityId = await getCommunityIdByCallsign(communityCallsign);

        if (!communityId) {
          return null;
        }

        const postStub = await createPost({ title, body, communityId, authorId });

        if (postStub) {
          return postStub.id;
        }
      },
    },
    joinCommunity: {
      type: CommunityType,
      args: {
        userId: {
          type: GraphQLID,
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
    createComment: {
      type: CommentType,
      args: {
        userId: {
          type: GraphQLID,
        },
        postId: {
          type: GraphQLID,
        },
        body: {
          type: GraphQLString,
        },
      },
      resolve: async (source, args, context) => {
        const postId: string = args.postId;
        const userId: string = args.userId;
        const body: string = args.body;

        const post = await getPostById(postId);
        const user = await getUserById(userId);

        if (!post || !user) {
          return null;
        }

        return createComment({
          authorId: user.id,
          body,
          postId: post.id,
        });
      },
    },
  },
});

export default MutationType;
