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
          `#graphql
            {
              communities {
                id,
                callsign,
                title,
                description
              }
            }
          `
        );

        expect(response.body.data.communities).toMatchObject(
          communities.map((c: any) => ({
            id: "" + c.id, // graphql always returns string for id fields, as per spec
            title: c.title,
            description: c.description,
            callsign: c.callsign,
          }))
        );
      });

      it("can fetch a community by callsign", async () => {
        const c = communities[0];

        const response = await query(app).gqlQuery(
          `#graphql
            query Query ($callsign: String!) {
              community(callsign: $callsign) {
                id,
                callsign,
                title,
                description
              }
            }
          `,
          {
            callsign: c.callsign,
          }
        );

        expect(response.body.data.community).toMatchObject({
          id: "" + c.id,
          title: c.title,
          description: c.description,
          callsign: c.callsign,
        });
      });

      it("Allows users to join communities.", async () => {
        const user = users[0];
        const community = communities[0];

        const response = await query(app)
          .gqlMutation(
            `#graphql
            mutation Mutation($userId: ID!, $communityCallsign: String!) {
              joinCommunity(userId: $userId, communityCallsign: $communityCallsign) {
                id,
                posts {
                  id
                }
              }
            }
            `,
            {
              userId: user.id,
              communityCallsign: community.callsign,
            }
          )
          .expect(200);

        expect(response?.body.data.joinCommunity).toBeTruthy();
      });
    });

    describe("error cases", () => {
      describe("query community", () => {
        it("requires either id and callsign", async () => {
          const response = await query(app).gqlQuery(
            `#graphql
            query Query($callsign: String, $id: ID) {
              community(callsign: $callsign, id: $id) {
                id
              }
            }
          `
          );

          expect(response.statusCode).toBe(200);
          expect(response?.body.data.community).toBe(null);
          expect(response.body.errors[0].extensions.errorCode).toBe(1000);
        });
      });
    });
  });
});
