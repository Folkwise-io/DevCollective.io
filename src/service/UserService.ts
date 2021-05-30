import bcrypt from "bcrypt";
import { getUserByEmail, insertUser } from "../data/UserRepo";

type CreateUserParams = EUser & {
  password: string;
  confirmationToken?: string;
};

export const sanitizeDbUser = (user: DUser): EUser => {
  const cleanUser = { ...user };
  // @ts-expect-error yes, we do indeed want to remove the passwordHash
  delete cleanUser.passwordHash;
  return cleanUser;
};

export const createUser = async ({ email, firstName, lastName, password, confirmationToken }: CreateUserParams) => {
  const passwordHash = await bcrypt.hash(password, 10);
  let confirmationTokenHash = confirmationToken && (await bcrypt.hash(confirmationToken, 10));

  const params = {
    email: email.trim().toLowerCase(),
    firstName,
    lastName,
    passwordHash,
    confirmationTokenHash,
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
