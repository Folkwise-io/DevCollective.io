import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { datasetLoader } from "../../dev/test/datasetLoader";
import { clearDatabase } from "../../dev/test/TestRepo";

describe("User object", () => {
  let app: Express;
  let users: any;
  let posts: any;

  beforeAll(async () => {
    await clearDatabase();
    app = appFactory();
  });

  beforeEach(async () => {
    const data = await datasetLoader();
    users = data.users;
    posts = data.posts;
  });

  describe("root user query", () => {
    describe("sunny cases", () => {
      it("can fetch all users", async () => {
        const response = await query(app).gqlQuery(
          `#graphql
            {
              users {
                id,
                firstName,
                lastName,
                createdAt,
                updatedAt
              }
            }
          `
        );

        expect(response.body.data.users.length).toEqual(users.length);
      });

      it("can fetch all posts for a given user", async () => {
        const user = users[1];
        const userPostIds = posts.filter((p: any) => p.authorId === user.id).map((p: any) => ({ id: p.id }));
        const response = await query(app).gqlQuery(
          `#graphql
          query Query($id: ID!) {
            user(id: $id) {
              id,
              posts {
                id
              }
            }
          }
          `,
          {
            id: user.id,
          }
        );
        expect(response.body.data.user.posts.map((p: any) => p.id).sort()).toMatchObject(
          userPostIds.map((p: any) => p.id).sort()
        );
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
