import DataLoader from "dataloader";

import knexProvider from "./knex-provider";
import { fieldGetterHoc, pickOne } from "./utils";

const userLoader = new DataLoader<string, DUser>(async (ids) => {
  const knex = await knexProvider();
  return knex(`users`).whereIn(`id`, ids);
});

export const getUserByEmail = async (email: string): Promise<DUser> => {
  const knex = await knexProvider();
  return knex(`users`)
    .where({
      email,
    })
    .first();
};

export const getUserById = async (id: string): Promise<DUser> => {
  const knex = await knexProvider();
  return knex(`users`).where({ id }).first();
};

export const getUserFieldById = fieldGetterHoc((id) => userLoader.load(id));

export const getAllUserIds = async () => {
  const knex = await knexProvider();
  const users = await knex.raw(`SELECT * FROM users`);
  users.rows.forEach((u: DUser) => {
    // TODO: Straighten up types so that "" + is not required
    userLoader.prime(`` + u.id, u);
  });
  return pickOne(`id`)(users.rows);
};

export const insertUser = (user: Partial<DUser>) => knexProvider().then((knex) => knex(`users`).insert(user));

export const updateUser = (id: number, userPartial: Partial<DUser>) =>
  knexProvider().then((knex) => knex(`users`).where({ id }).update(userPartial));
