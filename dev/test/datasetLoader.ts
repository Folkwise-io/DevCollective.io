import knexProvider from "../../src/data/knex-provider";
import { clearDatabase } from "./TestRepo";
import fs from "fs";
import path from "path";

const FOLDER_PATH = path.join(__dirname, "datasets");
const reader = (datasetName: string) => (filename: string) =>
  JSON.parse(fs.readFileSync(path.join(FOLDER_PATH, datasetName, filename + ".json"), "utf-8"));

export const datasetLoader = async (datasetName: string, verbose = false) => {
  const log = (...args: any[]) => verbose && console.log(...args);
  const stat = fs.statSync(path.join(FOLDER_PATH, datasetName));
  if (!stat.isDirectory) {
    throw new Error(`Dataset ${datasetName} does not exist.`);
  }

  log("Generating data...");
  const r = reader(datasetName);
  const users = r("users");
  const communities = r("communities");
  const communitiesUsers = r("communitiesUsers");
  const posts = r("posts");

  const knex = await knexProvider();
  log("Clearing database...");
  await clearDatabase();

  const k = async (tableName: string, data: any) => {
    log(`Writing ${data.length} records to ${tableName}...`);
    return await knex(tableName).insert(data);
  };

  const seqReset = async (tableName: string) => {
    log(`Resetting ID sequence for table ${tableName}...`);
    const maxIdQuery = await knex(tableName).max("id as maxId").first();
    const maxId = maxIdQuery?.maxId;
    if (maxId === undefined) {
      throw new Error("Did not receive maxIdQuery for table " + tableName);
    }
    const newAmount = maxId + 1;
    log(`Resetting ID sequence for table ${tableName} to ${newAmount}`);
    await knex.raw(`ALTER SEQUENCE ${tableName}_id_seq RESTART WITH ${newAmount}`);
  };

  await k("users", users);
  seqReset("users");
  await k("communities", communities);
  seqReset("communities");
  await k("communitiesUsers", communitiesUsers);
  await k("posts", posts);
  seqReset("posts");

  return { users, communities, communitiesUsers, posts };
};
