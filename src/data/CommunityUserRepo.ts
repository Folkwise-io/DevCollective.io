import { getKnex } from "./knexProvider";

interface CommunityUserParams {
  userId: number;
  communityId: number;
}

export const createCommunityUser = async ({ userId, communityId }: CommunityUserParams): Promise<void> => {
  const knex = await getKnex();
  return await knex(`communitiesUsers`).insert({
    userId,
    communityId,
  });
};

export const getCommunityUser = async ({ userId, communityId }: CommunityUserParams) => {
  const knex = await getKnex();
  return knex(`communitiesUsers`)
    .where({
      userId,
      communityId,
    })
    .first();
};

// const communityLoader = new DataLoader<string, DCommunity>(async (ids) => {
//   const knex = await getKnex();
//   // @ts-ignore
//   return knex.raw<DCommunity[]>("select * from comunities where id in (?)", ids);
// });

// export const getCommunityFieldById = fieldGetterHoc((id) => communityLoader.load(id));

// export const getCommunityIdsForUserId = async (authorId: number) => {
//   const knex = await getKnex();
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
//   const knex = await getKnex();
//   const communities = await knex.raw("select * from communities");
//   communities.rows.forEach((c: DCommunity) => {
//     communityLoader.prime(c.id, c);
//   });
//   return pickOne("id")(communities.rows);
// };
