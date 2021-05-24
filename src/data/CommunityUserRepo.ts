import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";

interface CommunityUserParams {
  userId: string;
  communityId: string;
}

export const createCommunityUser = async ({ userId, communityId }: CommunityUserParams): Promise<void> => {
  const knex = await knexProvider();
  await knex("communitiesUsers").insert({
    userId,
    communityId,
  });
};

export const getCommunityUser = async ({ userId, communityId }: CommunityUserParams) => {
  const knex = await knexProvider();
  return knex("communitiesUsers")
    .where({
      userId,
      communityId,
    })
    .first();
};

// const communityLoader = new DataLoader<String, DCommunity>(async (ids) => {
//   const knex = await knexProvider();
//   // @ts-ignore
//   return knex.raw<DCommunity[]>("select * from comunities where id in (?)", ids);
// });

// export const getCommunityFieldById = fieldGetterHoc((id) => communityLoader.load(id));

// export const getCommunityIdsForUserId = async (authorId: string) => {
//   const knex = await knexProvider();
//   const communities = await knex.raw(
//     `
//     SELECT * FROM communities AS c
//       LEFT JOIN communitiesUsers AS cu ON c.id = cu.communityId
//     WHERE cu.userId = ?
//   `,
//     [authorId],
//   );
//   communities.rows.forEach((c: DCommunity) => communityLoader.prime(c.id, c));
//   return pickOne("id")(communities.rows);
// };

// export const getAllCommunityIds = async () => {
//   const knex = await knexProvider();
//   const communities = await knex.raw("select * from communities");
//   communities.rows.forEach((c: DCommunity) => {
//     communityLoader.prime(c.id, c);
//   });
//   return pickOne("id")(communities.rows);
// };
