import { getKnex } from "../../src/data/knexProvider";

export const clearDatabase = async () => {
  const knex = await getKnex();
  await knex(`users`).del();
  await knex(`communities`).del();
  await knex(`communitiesUsers`).del();
  await knex(`posts`).del();
};
