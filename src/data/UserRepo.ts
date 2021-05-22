import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knex from "./knex";

const userLoader = new DataLoader<String, DUser>(async (ids) =>
  // @ts-ignore
  knex.raw<DUser>("select * from users where id in (?)", ids)
);

export const getUserFieldById = fieldGetterHoc((id) => userLoader.load(id));

export const getAllUserIds = async () => {
  const users = await knex.raw("select * from users");
  users.rows.forEach((u: DUser) => {
    userLoader.prime(u.id, u);
  });
  return pickOne("id")(users.rows);
};
