import knexProvider from "../../../src/data/knex-provider";
import datasetFactory from "../factories/datasetFactory";

export async function seed(): Promise<void> {
  // clear database
  const knex = await knexProvider();
  await knex("users").del();
  await knex("communities").del();
  await knex("communitiesUsers").del();
  await knex("posts").del();

  const { users, communities, communitiesUsers, posts } = datasetFactory({
    totalUsers: 20,
    totalCommunities: 1,
    userCommunityProbability: 0.5,
    totalPosts: 100,
  });

  await knex("users").insert(users);
  await knex("communities").insert(communities);
  await knex("communitiesUsers").insert(communitiesUsers);
  await knex("posts").insert(posts);

  // because we're inserting our own IDs, the autoincrement sequences won't be
  // triggered. here, we manually update sequences for autoincremented fields
  // so that primary keys are synchronized with the sequences.
  const resetMax = async (tableName: string) => {
    const maxIdQuery = await knex(tableName).max("id as maxId").first();
    if (!maxIdQuery) {
      throw new Error("Did not receive maxIdQuery for table " + tableName);
    }
    await knex.raw(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${maxIdQuery.maxId}`);
    const checkResponse = await knex.raw(`SELECT * FROM ${tableName}_id_seq`);
    console.log(`${tableName}_id_seq set to ${checkResponse.rows[0].last_value}`);
  };
  await resetMax("users");
  await resetMax("communities");
  await resetMax("posts");
}
