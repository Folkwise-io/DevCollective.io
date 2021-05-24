import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";
import knex, { Knex } from "knex";

const userLoader = new DataLoader<String, DUser>(async (ids) =>
  // @ts-ignore
  knexProvider().then((knex) => knex.raw<DUser>("select * from users where id in (?)", ids)),
);

export const getUserByEmail = async (email: string): Promise<Knex.Raw<DUser>> => {
  const knex = await knexProvider();
  const response = await knex.raw("select * from users where email = (?)", email);
  return response;
};

export const getUserById = async (id: string): Promise<Knex.Raw<DUser>> => {
  const knex = await knexProvider();
  const response = await knex.raw("select * from users where id = (?)", id);
  return response;
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
