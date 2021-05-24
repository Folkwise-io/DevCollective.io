import knexProvider from "../../../../src/data/knex-provider";
import { clearDatabase } from "../../TestRepo";
const posts = require("./posts");
const users = require("./users");
const communities = require("./communities");
const communitiesUsers = require("./communitiesUsers");

export const user = users[0];

export const dataset_complex = async () => {
  const knex = await knexProvider();
  await clearDatabase();
  await knex("users").insert(users);
  await knex("communities").insert(communities);
  await knex("communitiesUsers").insert(communitiesUsers);
  await knex("posts").insert(posts);
};

export { posts, users, communities, communitiesUsers };
