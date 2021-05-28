import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";

const communityLoader = new DataLoader<String, DCommunity>(async (ids) => {
  const knex = await knexProvider();
  return knex("communities").whereIn("id", ids);
});

export const getCommunityIdByCallsign = async (communityCallsign: string): Promise<String> => {
  const knex = await knexProvider();
  const community = await knex("communities")
    .select("id")
    .where({
      callsign: communityCallsign,
    })
    .first();
  return community.id;
};

export const getCommunityFieldById = fieldGetterHoc((id) => communityLoader.load(id));

export const getCommunityIdsForUserId = async (authorId: string) => {
  const knex = await knexProvider();
  const communities = await knex.raw(
    `
    SELECT * FROM communities AS c
      LEFT JOIN communitiesUsers AS cu ON c.id = cu.communityId
    WHERE cu.userId = ?
  `,
    [authorId],
  );
  communities.rows.forEach((c: DCommunity) => communityLoader.prime(c.id, c));
  return pickOne("id")(communities.rows);
};

export const getAllCommunityIds = async () => {
  const knex = await knexProvider();
  const communities = await knex.raw("select * from communities");
  communities.rows.forEach((c: DCommunity) => {
    communityLoader.prime(c.id, c);
  });
  return pickOne("id")(communities.rows);
};
