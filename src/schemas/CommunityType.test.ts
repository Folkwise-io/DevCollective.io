import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";

describe("Community object", () => {
  let app: Express;
  let communities: any;
  let users: any;

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  beforeEach(async (done) => {
    const data = await datasetLoader("simple");
    communities = data.communities;
    users = data.users;
    done();
  });

  describe("root community query", () => {
    describe("sunny cases", () => {
      it("can fetch all communities", async () => {
        const response = await query(app).gqlQuery(
          `
            {
              communities {
                id,
                title,
                description
              }
            }
          `,
        );

        expect(response.body.data.communities).toMatchObject(
          communities.map((c: any) => ({ id: c.id, title: c.title, description: c.description })),
        );
      });

      it("Allows users to join communities.", async () => {
        const user = users[0];
        const community = communities[0];

        const response = await query(app)
          .gqlMutation(
            `
            mutation Mutation($userId: String!, $communityId: String!) {
              joinCommunity(userId: $userId, communityId: $communityId) {
                id,
                posts {
                  id
                }
              }
            }
            `,
            {
              userId: user.id,
              communityId: community.id,
            },
          )
          .expect(200);

        expect(response?.body.data.joinCommunity).toBeTruthy();
      });

      //     it("can fetch all posts for a given user", async () => {
      //       const user = users[1];
      //       const userPostIds = posts.filter((p: any) => p.authorId === user.id).map((p: any) => ({ id: p.id }));
      //       const response = await query(app).gql(
      //         `
      //         query Query($id: String!) {
      //           user(id: $id) {
      //             id,
      //             posts {
      //               id
      //             }
      //           }
      //         }
      //         `,
      //         {
      //           id: user.id,
      //         },
      //       );
      //       expect(response.body.data.user.posts).toMatchObject(userPostIds);
      //     });
      //   });

      //   describe("rainy cases", () => {
      //     it("does not provide email", async () => {
      //       const response = await query(app).gql(
      //         `
      //         {
      //           users {
      //             email
      //           }
      //         }
      //       `,
      //       );
      //       expect(response.body.errors[0].message).toEqual('Cannot query field "email" on type "User".');
      //     });
      //     it("does not provide password", async () => {
      //       const response = await query(app).gql(
      //         `
      //         {
      //           users {
      //             password
      //           }
      //         }
      //       `,
      //       );
      //       expect(response.body.errors[0].message).toEqual('Cannot query field "password" on type "User".');
      //     });
      //     it("does not provide passwordHash", async () => {
      //       const response = await query(app).gql(
      //         `
      //         {
      //           users {
      //             passwordHash
      //           }
      //         }
      //       `,
      //       );
      //       expect(response.body.errors[0].message).toEqual('Cannot query field "passwordHash" on type "User".');
      //     });
    });
  });
});
