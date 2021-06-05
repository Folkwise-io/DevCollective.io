// This file contains types for the database layer.

interface EUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  accountConfirmationPending: boolean;
  createdAt: Date;
  updatedAt: Date;
}
