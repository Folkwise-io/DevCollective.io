import { Express } from "express";

import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import appFactory from "../appFactory";
import { createComment } from "../data/CommentRepo";
import TestManager from "../test/TestManager";

describe(`Post object`, () => {
  let app: Express;
  let users: DUser[];
  let tm: TestManager;
  let posts: DPost[];

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    const data = await datasetLoader();
    tm = new TestManager(app);
    users = data.users;
    posts = data.posts;
  });

  describe(`queries`, () => {
    describe(`sunny`, () => {
      it(`can get all comments for a post.`, async () => {
        const user = users[0];
        const post = posts.find((p: DPost) => p.authorId === user.id)!;

        const comments = [
          {
            body: `This is comment number 1`,
            authorId: `` + user.id,
            postId: post?.id,
          },
          {
            body: `This is comment number 2`,
            authorId: `` + user.id,
            postId: post?.id,
          },
          {
            body: `This is comment number 3`,
            authorId: `` + user.id,
            postId: post?.id,
          },
        ];

        // directly create 3 comments for a post
        // TODO: Fix types
        // @ts-expect-error number/string mismatch
        await Promise.all(comments.map((c) => createComment(c)));

        // query for those 3 comments
        const response = await tm.gql(
          `
          query Query($id: ID!) {
            post(id: $id) {
              comments {
                id
                body
                author {
                  id
                  firstName
                  lastName
                }
              }
            }
          }
        `,
          {
            id: post.id,
          },
        );

        expect(response.body.errors).toBeUndefined();
        response.body.data.post.comments.forEach((comment: any) => {
          expect(comment.id).toBeTruthy();
        });

        for (let i = 0; i < response.body.data.post.comments; i++) {
          const actual = response.body.data.post.comments[i];
          const expected = comments[i];
          expect(actual.author.id).toMatch(expected.authorId);
          expect(actual.body).toMatch(expected.body);
        }
      });

      it(`can get all comments for a user.`, async () => {
        // directly create 3 comments for a user
        const user = users[0];
        const post = posts.find((p: DPost) => p.authorId === user.id);

        const comments = [
          {
            body: `This is comment number 1`,
            authorId: `` + user.id,
            postId: post?.id,
          },
          {
            body: `This is comment number 2`,
            authorId: `` + user.id,
            postId: post?.id,
          },
          {
            body: `This is comment number 3`,
            authorId: `` + user.id,
            postId: post?.id,
          },
        ];

        // directly create 3 comments for a post
        // TODO: Fix types
        // @ts-expect-error number/string mismatch
        await Promise.all(comments.map((c) => createComment(c)));

        // query for those 3 comments
        const response = await tm.gql(
          `
          query Query($id: ID!) {
            user(id: $id) {
              comments {
                id
                body
                post {
                  id
                }
              }
            }
          }
        `,
          {
            id: user.id,
          },
        );

        // query for those 3 comments
        // expect 3 comments to match
        expect(response.body.errors).toBeUndefined();

        response.body.data.user.comments.forEach((comment: any) => {
          expect(comment.id).toBeTruthy();
        });

        for (let i = 0; i < response.body.data.user.comments; i++) {
          const actual = response.body.data.user.comments[i];
          const expected = comments[i];
          expect(actual.post.id).toEqual(expected.postId);
          expect(actual.body).toMatch(expected.body);
        }
      });

      it(`returns an empty array if a user does not have comments`, async () => {
        // no comments have been created.
        const response = await tm.gql(
          `
          query Query($id: ID!) {
            user(id: $id) {
              comments {
                id
                body
              }
            }
          }
        `,
          {
            id: users[0].id,
          },
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.data.user.comments).toMatchObject([]);
      });

      it(`returns an empty array if a post does not have comments`, async () => {
        // no comments have been created.
        const response = await tm.gql(
          `
          query Query($id: ID!) {
            post(id: $id) {
              comments {
                id
                body
              }
            }
          }
        `,
          {
            id: posts[0].id,
          },
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.data.post.comments).toMatchObject([]);
      });
    });
  });

  describe(`mutations`, () => {
    describe(`sunny`, () => {
      it(`can create top-level comment for a post.`, async () => {
        const user = users[0];
        const post = posts[0];

        await tm.login(user.email, `password`).expect(200);

        const body = `Happy Holidays!`;
        const responseBody = `Happy Canada Day!`;

        let parentCommentId: string;

        // a top-level comment can be created
        {
          const response = await tm.gql(
            `
            mutation Mutation($postId: ID!, $body: String!, $authorId: ID!) {
              createComment(postId: $postId, body: $body, authorId: $authorId) {
                id
                body,
                post {
                  id
                }
                author {
                  id
                }
              }
            }
          `,
            {
              postId: post.id,
              authorId: user.id,
              body,
            },
          );

          expect(response.statusCode).toBe(200);
          expect(response.body.errors).toBeFalsy();
          expect(response.body.data.createComment.id).toBeTruthy();
          expect(response.body.data.createComment.body).toStrictEqual(body);
          expect(response.body.data.createComment.post.id).toStrictEqual(`` + post.id);
          expect(response.body.data.createComment.author.id).toStrictEqual(`` + user.id);

          parentCommentId = response.body.data.createComment.id;
        }

        // the comment shows up in a community->posts->comments call.
        {
          const response = await tm.gql(
            `#graphql
            query Query($id: ID!) {
              community(id: $id) {
                posts {
                  id
                  comments {
                    id
                    body
                  }
                }
              }
            }
          `,
            {
              id: post.communityId,
            },
          );

          expect(response.statusCode).toBe(200);
          expect(response.body.errors).toBeFalsy();

          const postsWithComments = response.body.data.community.posts.filter((p: any) => p.comments.length > 0);
          expect(postsWithComments.length).toBe(1);
          const postWithComment = postsWithComments[0];

          expect(postWithComment.comments.length).toBe(1);
          expect(postWithComment.comments[0].body).toBe(body);
        }

        // test responding to the comment in a thread (1 level deep)
        {
          const response = await tm.gql(
            `#graphql
              mutation Mutation($postId: ID!, $body: String!, $authorId: ID!, $parentCommentId: ID) {
                createComment(postId: $postId, body: $body, authorId: $authorId, parentCommentId: $parentCommentId) {
                  id
                  body,
                  post {
                    id
                  }
                  author {
                    id
                  }
                  parentComment {
                    id
                    body
                    post {
                      id
                    }
                  }
                }
              } 
            `,
            {
              postId: post.id,
              body: responseBody,
              authorId: user.id,
              parentCommentId,
            },
          );

          expect(response.statusCode).toBe(200);
          expect(response.body.errors).toBeFalsy();
          expect(response.body.data.createComment.id).toBeTruthy();
          expect(response.body.data.createComment.body).toBe(responseBody);
          expect(response.body.data.createComment.parentComment.id).toBe(parentCommentId);
          expect(response.body.data.createComment.parentComment.body).toBe(body);
          expect(response.body.data.createComment.post.id).toBe(`` + post.id);
        }
      });
    });

    describe(`validations`, () => {
      it(`requires the user to be logged in`, async () => {
        // TODO
      });

      it(`requires a body of at least a single character`, () => {
        // TODO
      });

      it(`has a max comment length of 1000`, () => {
        // TODO
      });

      it(`requires postId/communityId/authorId, and parentCommentId is optional`, () => {
        // TODO
      });
    });
  });
});
