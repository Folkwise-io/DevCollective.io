import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import { createComment, getCommentById } from "../data/CommentRepo";
import { getCommunityIdByCallsign } from "../data/CommunityRepo";
import { createCommunityUser, getCommunityUser } from "../data/CommunityUserRepo";
import { createPost, getPostById } from "../data/PostRepo";
import { getUserById, updateUser } from "../data/UserRepo";
import CommentType from "./CommentType";
import CommunityType from "./CommunityType";
import EditUserInput from "./dtos/EditUserInput";
import PostType from "./PostType";
import UserType from "./UserType";

const MutationType = new GraphQLObjectType({
  name: `Mutation`,
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

        const communityUser = await getCommunityUser({ userId: user.id, communityId });
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
    editUser: {
      type: UserType,
      args: {
        id: {
          type: GraphQLInt,
        },
        editUserInput: {
          type: GraphQLNonNull(EditUserInput),
        },
      },
      resolve: async (source, args, context) => {
        await updateUser(args.id, { firstName: args.editUserInput.firstName, lastName: args.editUserInput.lastName });

        return args.id;
      },
    },
  },
});

export default MutationType;
