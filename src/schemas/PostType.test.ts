import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";

describe("Post object", () => {
  let app: Express;
  let users: any;
  let posts: any;
  let communities: any;

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  beforeEach(async () => {
    const data = await datasetLoader("complex");
    users = data.users;
    posts = data.posts;
    communities = data.communities;
  });

  describe("root posts query", () => {
    describe("sunny cases", () => {
      it("can fetch all posts", async () => {
        const response = await query(app).gqlQuery(
          `#graphql
            {
              posts {
                id,
                title,
                body,
              }
            }
          `
        );

        expect(response.body.data.posts.map((p: any) => p.id).sort()).toEqual(posts.map((p: any) => p.id).sort());
      });

      it("can create posts", async () => {
        const params = {
          title: "Some new title",
          body: "A little body",
          communityCallsign: communities[0].callsign,
          authorId: users[0].id,
        };

        const response = await query(app).gqlMutation(
          `#graphql
          mutation Mutation($communityCallsign: String!, $title: String!, $body: String!, $authorId: String!) {
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
          params
        );

        expect(response.body?.errors?.length).toBeFalsy();
        expect(response.body?.data?.createPost?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.url).toBeTruthy();
        expect(response.body?.data?.createPost?.author?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.author?.firstName).toBeTruthy();
        expect(response.body?.data?.createPost?.community?.id).toBeTruthy();
        expect(response.body?.data?.createPost?.community?.callsign).toBeTruthy();
      });

      it("can fetch the community and author for a given post", async () => {
        const post = posts[1];
        const expectedAuthor = users.find((u: any) => u.id === post.authorId);
        const expectedCommunity = communities.find((c: any) => c.id === post.communityId);

        const response = await query(app).gqlQuery(
          `#graphql
          query Query($id: String!) {
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
          }
        );

        const responsePost = response.body.data.post;

        expect(responsePost.author.id).toEqual(expectedAuthor.id);
        expect(responsePost.community.id).toEqual(expectedCommunity.id);
      });
    });

    describe("rainy cases", () => {
      it("does not provide email", async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              email
            }
          }
        `
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "email" on type "User".');
      });
      it("does not provide password", async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              password
            }
          }
        `
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "password" on type "User".');
      });
      it("does not provide passwordHash", async () => {
        const response = await query(app).gqlQuery(
          `#graphql
          {
            users {
              passwordHash
            }
          }
        `
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "passwordHash" on type "User".');
      });
    });
  });
});
