import { posts, TPost } from "./fake-data";
import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";

const postLoader = new DataLoader(async (ids) =>
  posts.filter((post) => ids.indexOf(post.id) >= 0)
);

export const getPostFieldById = fieldGetterHoc((id) => postLoader.load(id));

export const getPostIdsForUserId = async (authorId: string) =>
  posts.filter((p) => p.createdBy === authorId).map(pickOne("id"));

export const getPostIdsForCommunityId = async (communityId: string) =>
  posts.filter((p) => p.community === communityId).map(pickOne("id"));

export const getAllPostIds = async () => posts.map((p) => p.id);
