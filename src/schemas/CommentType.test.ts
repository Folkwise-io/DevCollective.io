import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import TestManager from "../test/TestManager";
import { createComment } from "../data/CommentRepo";

describe("Post object", () => {
  let app: Express;
  let users: any;
  let tm: TestManager;
  let posts: any;
  let communities: any;

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
    communities = data.communities;
  });

  describe("queries", () => {
    describe("sunny", () => {
      it("can get all comments for a post.", async () => {
        const user = users[0];
        const post = posts.find((p: DPost) => p.authorId === user.id);

        const comments = [
          {
            body: "This is comment number 1",
            authorId: "" + user.id,
            postId: post.id,
          },
          {
            body: "This is comment number 2",
            authorId: "" + user.id,
            postId: post.id,
          },
          {
            body: "This is comment number 3",
            authorId: "" + user.id,
            postId: post.id,
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
          }
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

      it("can get all comments for a user.", async () => {
        // directly create 3 comments for a user
        const user = users[0];
        const post = posts.find((p: DPost) => p.authorId === user.id);

        const comments = [
          {
            body: "This is comment number 1",
            authorId: "" + user.id,
            postId: post.id,
          },
          {
            body: "This is comment number 2",
            authorId: "" + user.id,
            postId: post.id,
          },
          {
            body: "This is comment number 3",
            authorId: "" + user.id,
            postId: post.id,
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
          }
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
          expect(actual.post.id).toMatch(expected.postId);
          expect(actual.body).toMatch(expected.body);
        }
      });

      it("returns an empty array if a user does not have comments", async () => {
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
          }
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.data.user.comments).toMatchObject([]);
      });

      it("returns an empty array if a post does not have comments", async () => {
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
          }
        );

        expect(response.statusCode).toBe(200);
        expect(response.body.data.post.comments).toMatchObject([]);
      });
    });
  });

  describe("mutations", () => {
    describe("sunny", () => {
      it("can create top-level comment for a post.", () => {
        // login as a user
        // comment on a post
        // query post comments
        // expect the comment to be there.
      });

      it("can respond to comments.", () => {
        // login as a user
        // respond to a comment
        // query post comments
        // expect the comment to be there.
        // expect the comment parent to be the correct comment
      });
    });

    describe("validations", () => {
      it("requires the user to be logged in", () => {});

      it("requires a body of at least a single character", () => {});

      it("has a max comment length of 1000", () => {});
    });
  });

  // describe("root posts query", () => {
  //   describe("sunny cases", () => {
  //     it("can fetch all posts", async () => {
  //       const response = await query(app).gqlQuery(
  //         `#graphql
  //           {
  //             posts {
  //               id,
  //               title,
  //               body,
  //             }
  //           }
  //         `
  //       );

  //       expect(response.body.data.posts.map((p: any) => p.id).sort()).toEqual(posts.map((p: any) => p.id).sort());
  //     });

  //     it("can create posts", async () => {
  //       const params = {
  //         title: "Some new title",
  //         body: "A little body",
  //         communityCallsign: communities[0].callsign,
  //         authorId: "" + users[0].id,
  //       };

  //       const response = await query(app).gqlMutation(
  //         `#graphql
  //         mutation Mutation($communityCallsign: String!, $title: String!, $body: String!, $authorId: ID!) {
  //           createPost(communityCallsign: $communityCallsign, title: $title, body: $body, authorId: $authorId) {
  //             id
  //             title
  //             body
  //             url
  //             author {
  //               id
  //               firstName
  //             }
  //             community {
  //               id
  //               callsign
  //             }
  //           }
  //         }
  //       `,
  //         params
  //       );

  //       expect(response.body?.errors?.length).toBeFalsy();
  //       expect(response.body?.data?.createPost?.id).toBeTruthy();
  //       expect(response.body?.data?.createPost?.url).toBeTruthy();
  //       expect(response.body?.data?.createPost?.author?.id).toBeTruthy();
  //       expect(response.body?.data?.createPost?.author?.firstName).toBeTruthy();
  //       expect(response.body?.data?.createPost?.community?.id).toBeTruthy();
  //       expect(response.body?.data?.createPost?.community?.callsign).toBeTruthy();
  //     });

  //     it("can fetch the community and author for a given post", async () => {
  //       const post = posts[1];
  //       const expectedAuthor = users.find((u: any) => u.id === post.authorId);
  //       const expectedCommunity = communities.find((c: any) => c.id === post.communityId);

  //       const response = await query(app).gqlQuery(
  //         `#graphql
  //         query Query($id: ID!) {
  //           post(id: $id) {
  //             id,
  //             author {
  //               id
  //             }
  //             community {
  //               id
  //             }
  //           }
  //         }
  //         `,
  //         {
  //           id: post.id,
  //         }
  //       );

  //       const responsePost = response.body.data.post;

  //       expect(responsePost.author.id).toEqual("" + expectedAuthor.id);
  //       expect(responsePost.community.id).toEqual("" + expectedCommunity.id);
  //     });
  //   });

  //   describe("rainy cases", () => {
  //     it("does not provide email", async () => {
  //       const response = await query(app).gqlQuery(
  //         `#graphql
  //         {
  //           users {
  //             email
  //           }
  //         }
  //       `
  //       );
  //       expect(response.body.errors[0].message).toEqual('Cannot query field "email" on type "User".');
  //     });
  //     it("does not provide password", async () => {
  //       const response = await query(app).gqlQuery(
  //         `#graphql
  //         {
  //           users {
  //             password
  //           }
  //         }
  //       `
  //       );
  //       expect(response.body.errors[0].message).toEqual('Cannot query field "password" on type "User".');
  //     });
  //     it("does not provide passwordHash", async () => {
  //       const response = await query(app).gqlQuery(
  //         `#graphql
  //         {
  //           users {
  //             passwordHash
  //           }
  //         }
  //       `
  //       );
  //       expect(response.body.errors[0].message).toEqual('Cannot query field "passwordHash" on type "User".');
  //     });
  //   });
  // });
});
