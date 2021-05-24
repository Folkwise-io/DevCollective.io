import appFactory from "../appFactory";
import query from "../test/query";
import { Express } from "express";
import { dataset_complex, users, posts } from "../../dev/test/datasets/complex";

describe("User object", () => {
  let app: Express;

  beforeAll(async () => {
    app = appFactory();
  });

  beforeEach(async () => {
    await dataset_complex();
  });

  describe("root user query", () => {
    describe("sunny cases", () => {
      it("can fetch all users", async () => {
        const response = await query(app).gql(
          `
            {
              users {
                id,
                firstName,
                lastName,
                createdAt,
                updatedAt
              }
            }
          `,
        );

        expect(response.body.data.users.length).toEqual(users.length);
      });

      it("can fetch all posts for a given user", async () => {
        const user = users[1];
        const userPostIds = posts.filter((p: any) => p.authorId === user.id).map((p: any) => ({ id: p.id }));
        const response = await query(app).gql(
          `
          query Query($id: String!) {
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
          },
        );
        expect(response.body.data.user.posts).toMatchObject(userPostIds);
      });
    });

    describe("rainy cases", () => {
      it("does not provide email", async () => {
        const response = await query(app).gql(
          `
          {
            users {
              email
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "email" on type "User".');
      });
      it("does not provide password", async () => {
        const response = await query(app).gql(
          `
          {
            users {
              password
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "password" on type "User".');
      });
      it("does not provide passwordHash", async () => {
        const response = await query(app).gql(
          `
          {
            users {
              passwordHash
            }
          }
        `,
        );
        expect(response.body.errors[0].message).toEqual('Cannot query field "passwordHash" on type "User".');
      });
    });
  });
});
