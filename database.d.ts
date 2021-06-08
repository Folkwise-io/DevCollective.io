// This file contains types for the database layer.

interface DUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  confirmationTokenHash: string | null;
  forgotPasswordTokenHash: string | null;
  forgotPasswordExpiry: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// This file contains types for the database layer.
interface DCommunity {
  id: number;
  title: string;
  callsign: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DPost {
  id: number;
  authorId: number;
  communityId: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DCommunitiesUsers {
  userId: number;
  communityId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DComment {
  id: number;
  authorId: number;
  postId: number;
  parentCommentId?: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
