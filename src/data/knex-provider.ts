import Knex from "knex";
import fs from "fs";
import path from "path";

const getKnex = async () => {
  const { MB_KNEXFILE } = process.env;

  if (!MB_KNEXFILE) {
    throw new Error("Env variable MB_KNEXFILE must be provided.");
  }

  const knexfilePath = path.join(__dirname, "../..", MB_KNEXFILE);

  const stat = fs.statSync(knexfilePath);
  if (!stat.isFile) {
    throw new Error(`Knexfile at ${MB_KNEXFILE} is not a file.`);
  }

  let knexfile;
  try {
    // const knexFileString = fs.readFileSync(MB_KNEXFILE, "utf-8");
    knexfile = await import(knexfilePath);
  } catch (e) {
    console.error(`Failed to load knexfile at ${MB_KNEXFILE}!`);
    throw e;
  }

  const knex = Knex(knexfile);
  console.log("knex.raw", knex.raw);
  return knex;
};

export default getKnex;
