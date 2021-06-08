import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";

const communityLoader = new DataLoader<string, DCommunity>(async (ids) => {
  const knex = await knexProvider();
  return knex<DCommunity>("communities").whereIn("id", ids);
});

export const getCommunityIdByCallsign = async (communityCallsign: string): Promise<number> => {
  const knex = await knexProvider();
  const community: DCommunity = await knex("communities")
    .select("*")
    .where({
      callsign: communityCallsign,
    })
    .first();

  if (community && community.id) {
    // TODO: Straighten up types so that "" + is not required
    communityLoader.prime("" + community.id, community);
  }

  return community.id;
};

export const getCommunityFieldById = fieldGetterHoc((id) => communityLoader.load(id));

export const getCommunityIdsForUserId = async (authorId: number) => {
  const knex = await knexProvider();
  const communities = await knex.raw(
    `
    SELECT * FROM communities AS c
      LEFT JOIN communitiesUsers AS cu ON c.id = cu.communityId
    WHERE cu.userId = ?
  `,
    [authorId]
  );
  // TODO: Straighten up types so that "" + is not required
  communities.rows.forEach((c: DCommunity) => communityLoader.prime("" + c.id, c));
  return pickOne("id")(communities.rows);
};

export const getAllCommunityIds = async () => {
  const knex = await knexProvider();
  const communities = await knex.raw("select * from communities");
  communities.rows.forEach((c: DCommunity) => {
    // TODO: Straighten up types so that "" + is not required
    communityLoader.prime("" + c.id, c);
  });
  return pickOne("id")(communities.rows);
};
