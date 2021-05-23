import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knex from "./knex";

const communityLoader = new DataLoader<String, DCommunity>(async (ids) =>
  // @ts-ignore
  knex.raw<DCommunity>("select * from comunities where id in (?)", ids),
);

export const getCommunityFieldById = fieldGetterHoc((id) => communityLoader.load(id));

export const getCommunityIdsForUserId = async (authorId: string) => {
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
  const communities = await knex.raw("select * from communities");
  communities.rows.forEach((c: DCommunity) => {
    communityLoader.prime(c.id, c);
  });
  return pickOne("id")(communities.rows);
};
