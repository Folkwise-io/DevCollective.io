import { users } from "./fake-data";
import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";

const userLoader = new DataLoader(async (ids) =>
  users.filter((user) => ids.indexOf(user.id) >= 0)
);

export const getUserFieldById = fieldGetterHoc((id) => userLoader.load(id));

export const getAllUserIds = () => Promise.resolve(users).then(pickOne("id"));
