// This file contains types for the database layer.

type EUser = Omit<DUser, "passwordHash", "confirmationTokenHash">;
