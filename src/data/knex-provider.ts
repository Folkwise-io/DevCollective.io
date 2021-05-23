import Knex, { Knex as IKnex } from "knex";
import fs from "fs";
import path from "path";

let instance: IKnex<any, unknown[]>;

const getKnexfileValue = () => {
  // first try MB_KNEXFILE
  if (process.env.MB_KNEXFILE) {
    return process.env.MB_KNEXFILE;
  }

  // knex try --knexfile cli arg
  const flagIndex = process.argv.indexOf?.("--knexfile");
  if (flagIndex >= 0 && process.argv.length >= flagIndex + 2) {
    return process.argv[flagIndex + 1];
  } else {
    throw new Error(
      "Either the MB_KNEXFILE env var or the --knexfile parameter is mandatory during initialization of this project.",
    );
  }
};

const getKnex = async () => {
  if (!instance) {
    const knexfileValue = getKnexfileValue();
    const knexfilePath = path.resolve(__dirname, "../..", knexfileValue);

    const stat = fs.statSync(knexfilePath);
    if (!stat.isFile) {
      throw new Error(`Knexfile at ${knexfileValue} is not a file.`);
    }

    let knexfile;
    try {
      knexfile = await import(knexfilePath);
    } catch (e) {
      console.error(`Failed to load knexfile at ${knexfileValue}!`);
      throw e;
    }

    instance = Knex(knexfile.default);
  }

  return instance;
};

export default getKnex;
