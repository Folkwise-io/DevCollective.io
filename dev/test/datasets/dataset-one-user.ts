import { createUser } from "../../../src/service/UserService";
import { clearDatabase } from "../TestRepo";

export const user = {
  email: "test@test.com",
  firstName: "John",
  lastName: "Doe",
  password: "password",
};

export const dataset_oneUser = async () => {
  await clearDatabase();
  await createUser(user);
};
