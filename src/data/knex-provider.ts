import Knex, { Knex as IKnex } from "knex";
import fs from "fs";
import path from "path";

let instance: IKnex<any, unknown[]>;

const getKnex = async () => {
  if (!instance) {
    const { MB_KNEXFILE } = process.env;

    if (!MB_KNEXFILE) {
      throw new Error("Env variable MB_KNEXFILE must be provided.");
    }

    const knexfilePath = path.resolve(__dirname, "../..", MB_KNEXFILE);

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

    instance = Knex(knexfile);
  }

  return instance;
};

export default getKnex;
