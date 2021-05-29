import bcrypt from "bcrypt";
import { getUserByEmail, insertUser } from "../data/UserRepo";

type CreateUserParams = Omit<DUser, "id" | "createdAt" | "updatedAt" | "passwordHash"> & {
  password: string;
};

export const sanitizeDbUser = (user: DUser): EUser => {
  const cleanUser = { ...user };
  // @ts-expect-error yes, we do indeed want to remove the passwordHash
  delete cleanUser.passwordHash;
  return cleanUser;
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
  const user: DUser = await getUserByEmail(email);
  const isLoginValid = user && (await bcrypt.compare(password, user.passwordHash));

  if (!isLoginValid) {
    return null;
  }

  return sanitizeDbUser(user);
};
