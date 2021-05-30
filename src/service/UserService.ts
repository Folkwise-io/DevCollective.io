import bcrypt from "bcrypt";
import { getUserByEmail, insertUser } from "../data/UserRepo";

export const sanitizeDbUser = (user: DUser): EUser => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    accountConfirmationPending: !!user.confirmationTokenHash,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };
};

interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmationToken?: string;
}
export const createUser = async (createUserParams: CreateUserParams) => {
  const { email, firstName, lastName, password, confirmationToken } = createUserParams;
  const passwordHash = await bcrypt.hash(password, 10);
  let confirmationTokenHash = confirmationToken && (await bcrypt.hash(confirmationToken, 10));

  const insertUserParams = {
    email: email.trim().toLowerCase(),
    firstName,
    lastName,
    passwordHash,
    confirmationTokenHash,
  };

  return insertUser(insertUserParams);
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
