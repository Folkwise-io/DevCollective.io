import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";

const userLoader = new DataLoader<String, DUser>(async (ids) =>
  // @ts-ignore
  knexProvider().then((knex) => knex.raw<DUser>("select * from users where id in (?)", ids)),
);

export const getUserFieldById = fieldGetterHoc((id) => userLoader.load(id));

export const getAllUserIds = async () => {
  const knex = await knexProvider();
  const users = await knex.raw("SELECT * FROM users");
  users.rows.forEach((u: DUser) => {
    userLoader.prime(u.id, u);
  });
  return pickOne("id")(users.rows);
};
