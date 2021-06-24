import { Express } from "express";

import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";
import appFactory from "../appFactory";
import { getPostById, postLoader } from "../data/PostRepo";
import query from "../test/query";

describe(`Post object`, () => {
  let app: Express;
  let users: any;
  let posts: any;
  let communities: any;

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  beforeEach(async () => {
    const data = await datasetLoader();
    users = data.users;
    posts = data.posts;
    communities = data.communities;
  });

  describe(`root posts query`, () => {
    describe(`sunny cases`, () => {
      it(`can fetch all posts`, async () => {
        const response = await query(app).gqlQuery(
          `#graphql
            {
              posts {
                id,
                title,
                body,
              }
            }
          `,
        );

        expect(response.body.data.posts.map((p: any) => p.id).sort()).toEqual(posts.map((p: any) => `` + p.id).sort());
      });

      it(`can create posts`, async () => {
        const params = {
          title: `Some new title`,
          body: `A little body`,
          communityCallsign: communities[0].callsign,
          authorId: `` + users[0].id,
        };

        const response = await query(app).gqlMutation(
          `#graphql
          mutation Mutation($communityCallsign: String!, $title: String!, $body: String!, $authorId: ID!) {
            createPost(communityCallsign: $communityCallsign, title: $title, body: $body, authorId: $authorId) {
              id
              title
              body
              url
              author {
                id
                firstName
              }
              community {
                id
                callsign
              }
            }
          }
        `,
          params,
        );

        expect(response.body?.errors?.length).toBeFalsy();
        expect(response.body?.data?.createPost?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.url).toBeTruthy();
        expect(response.body?.data?.createPost?.author?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.author?.firstName).toBeTruthy();
        expect(response.body?.data?.createPost?.community?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.community?.callsign).toBeTruthy();
      });

      it(`can edit posts`, async () => {
        // 1. fetch a post owned by the user that already exists.

        const post = await getPostById(`` + 1);

        console.log(`THE DATABASE POST BEFORE`, post);
        // check edit title
        {
          const NEW_TITLE = `Some new title`;
          const POST_ID = 1;

          // 2. edit title
          const params = {
            id: POST_ID,
            post: {
              title: NEW_TITLE,
            },
          };

          postLoader.clearAll();

          const response = await query(app).gqlMutation(
            `#graphql
            mutation Mutation($id: ID!, $post: EditPostInput!) {
              editPost(id: $id, post: $post) {
                id
                title
                body
                url
                author {
                  id
                  firstName
                }
                # TODO: Community is not working
                # community {
                #   id
                #   callsign
                # }
              }
            }
          `,
            params,
          );

          console.log(`ERRORS`, response.body.errors);
          expect(response.body?.errors?.length).toBeFalsy();
          expect(response.body.data.editPost.id).toStrictEqual(`` + POST_ID);
          expect(response.body.data.editPost.title).toStrictEqual(NEW_TITLE);

          const post = await getPostById(`` + 1);
          postLoader.clearAll();
          console.log(`THE DATABASE POST AFTER TITLE EDIT`, post);
        }

        // check edit body
        {
          const NEW_BODY = `Some new body`;
          const POST_ID = 1;

          // 2. edit title
          const params = {
            id: POST_ID,
            post: {
              body: NEW_BODY,
            },
          };

          const response = await query(app).gqlMutation(
            `#graphql
            mutation Mutation($id: ID!, $post: EditPostInput!) {
              editPost(id: $id, post: $post) {
                id
                title
                body
                url
                author {
                  id
                  firstName
                }
                # TODO: Community is not working
                # community {
                #   id
                #   callsign
                # }
              }
            }
          `,
            params,
          );

          const post = await getPostById(`` + 1);
          postLoader.clearAll();
          console.log(`THE DATABASE POST AFTER EDIT`, post);

          expect(response.body?.errors?.length).toBeFalsy();
          expect(response.body.data.editPost.id).toStrictEqual(`` + POST_ID);
          expect(response.body.data.editPost.body).toStrictEqual(NEW_BODY);
        }

        // 4. edit body
        // 5. assert body should be edited
        // 6. edit title + body
        // 7. assert body + title should be edited
      });

      it(`can fetch the community and author for a given post`, async () => {
        const post = posts[1];
        const expectedAuthor = users.find((u: any) => u.id === post.authorId);
        const expectedCommunity = communities.find((c: any) => c.id === post.communityId);

        const response = await query(app).gqlQuery(
          `#graphql
          query Query($id: ID!) {
            post(id: $id) {
              id,
              author {
                id
              }
              community {
                id
              }
            }
          }
          `,
          {
            id: post.id,
          },
        );

        const responsePost = response.body.data.post;

        expect(responsePost.author.id).toEqual(`` + expectedAuthor.id);
        expect(responsePost.community.id).toEqual(`` + expectedCommunity.id);
      });
    });

    describe(`rainy cases`, () => {
      it(`does not provide email`, async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              email
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual(`Cannot query field "email" on type "User".`);
      });
      it(`does not provide password`, async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              password
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual(`Cannot query field "password" on type "User".`);
      });
      it(`does not provide passwordHash`, async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              passwordHash
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual(`Cannot query field "passwordHash" on type "User".`);
      });
    });
  });
});
