import fs from "fs";
import Knex, { Knex as IKnex } from "knex";
import path from "path";

import configProvider from "../configProvider";

let instance: IKnex<any, unknown[]>;

export async function getKnex() {
  if (!instance) {
    const { MB_KNEXFILE } = configProvider();
    const knexfilePath = path.resolve(__dirname, `../..`, MB_KNEXFILE);

    const stat = fs.statSync(knexfilePath);
    if (!stat.isFile) {
      throw new Error(`Knexfile at ${MB_KNEXFILE} is not a file.`);
    }

    let knexfile;
    try {
      knexfile = await import(knexfilePath);
    } catch (e) {
      console.error(`Failed to load knexfile at ${MB_KNEXFILE}!`);
      throw e;
    }

    instance = Knex(knexfile.default);
  }

  return instance;
}
