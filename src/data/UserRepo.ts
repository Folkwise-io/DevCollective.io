import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";
import knex, { Knex } from "knex";

const userLoader = new DataLoader<string, DUser>(async (ids) => {
  const knex = await knexProvider();
  return knex("users").whereIn("id", ids);
});

export const getUserByEmail = async (email: string): Promise<DUser> => {
  const knex = await knexProvider();
  return await knex("users")
    .where({
      email,
    })
    .first();
};

export const getUserById = async (id: string): Promise<DUser> => {
  const knex = await knexProvider();
  return knex("users").where({ id }).first();
};

export const getUserFieldById = fieldGetterHoc((id) => userLoader.load(id));

export const getAllUserIds = async () => {
  const knex = await knexProvider();
  const users = await knex.raw("SELECT * FROM users");
  users.rows.forEach((u: DUser) => {
    userLoader.prime(u.id, u);
  });
  return pickOne("id")(users.rows);
};

type InsertUserParams = Omit<DUser, "id" | "createdAt" | "updatedAt">;
export const insertUser = (user: InsertUserParams) => knexProvider().then((knex) => knex("users").insert(user));
