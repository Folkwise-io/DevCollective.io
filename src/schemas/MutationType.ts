import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString, isRequiredArgument } from "graphql";
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
import { createComment, getCommentFieldById, getCommentById } from "../data/CommentRepo";

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createPost: {
      type: PostType,
      args: {
        title: {
          type: GraphQLNonNull(GraphQLString),
        },
        body: {
          type: GraphQLNonNull(GraphQLString),
        },
        communityCallsign: {
          type: GraphQLNonNull(GraphQLString),
        },
        authorId: {
          type: GraphQLNonNull(GraphQLID),
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
        authorId: {
          type: GraphQLNonNull(GraphQLID),
        },
        parentCommentId: {
          type: GraphQLID,
        },
        postId: {
          type: GraphQLNonNull(GraphQLID),
        },
        body: {
          type: GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (source, args, context) => {
        const postId: string = args.postId;
        const authorId: string = args.authorId;
        const body: string = args.body;
        const parentCommentId: string = args.parentCommentId;

        const post = await getPostById(postId);
        const user = await getUserById(authorId);

        if (!post) {
          throw new Error(`post with id ${postId} does not exist.`);
        }
        if (!user) {
          throw new Error(`user with id ${authorId} does not exist.`);
        }

        if (parentCommentId) {
          const parentComment = await getCommentById(parentCommentId);
          if (!parentComment) {
            throw new Error(`comment with id ${parentCommentId} does not exist`);
          }
        }

        const comment = await createComment({
          authorId: user.id,
          body,
          postId: post.id,
          parentCommentId: parentCommentId ? +parentCommentId : undefined,
        });

        return (comment && comment.id) || null;
      },
    },
  },
});

export default MutationType;
