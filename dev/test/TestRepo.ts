import { fieldGetterHoc, pickOne } from "../../src/data/utils";
import DataLoader from "dataloader";
import knexProvider from "../../src/data/knex-provider";

export const clearDatabase = async () => {
  const knex = await knexProvider();
  await knex("users").del();
  await knex("communities").del();
  await knex("communitiesUsers").del();
  await knex("posts").del();
};
