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
}
