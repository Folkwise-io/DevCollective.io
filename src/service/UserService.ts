import bcrypt from "bcrypt";
import { getUserByEmail, insertUser } from "../data/UserRepo";

type CreateUserParams = Omit<DUser, "id" | "createdAt" | "updatedAt" | "passwordHash"> & {
  password: string;
};
export const createUser = async ({ email, firstName, lastName, password }: CreateUserParams) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const params = {
    email: email.trim().toLowerCase(),
    firstName,
    lastName,
    passwordHash,
  };

  return insertUser(params);
};

type CheckPasswordParams = { email: string; password: string };
/**
 * Returns a user if the password check passed, or null if it failed.
 * @param params
 * @returns
 */
export const checkPassword = async (params: CheckPasswordParams): Promise<EUser | null> => {
  const { email, password } = params;
  const response: any = await getUserByEmail(email);
  const user: DUser = response?.rows[0];
  const isLoginValid = user && (await bcrypt.compare(password, user.passwordHash));

  if (isLoginValid) {
    const { id, firstName, lastName, email, createdAt, updatedAt } = user;
    return { id, firstName, lastName, email, createdAt, updatedAt };
  } else {
    return null;
  }
};
