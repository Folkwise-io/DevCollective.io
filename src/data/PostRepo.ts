import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knex from "./knex";

const postLoader = new DataLoader<String, DPost>(async (ids) =>
  // @ts-ignore
  knex.raw<DPost>("select * from posts where id in (?)", ids),
);

const prime = (posts: DPost[]) => {
  posts.forEach((p: DPost) => {
    postLoader.prime(p.id, p);
  });
  return pickOne("id")(posts);
};

export const getPostFieldById = fieldGetterHoc((id) => postLoader.load(id));

export const getPostIdsForCommunityId = async (communityId: string) => {
  const posts = await knex.raw("select * from posts where communityId = ?", []);
  prime(posts.rows);
  return pickOne("id")(posts.rows);
};

export const getAllPostIds = async () => {
  const posts = await knex.raw("select * from posts");
  prime(posts.rows);
  return pickOne("id")(posts.rows);
};

export const getPostIdsForUserId = async (userId: string) => {
  const posts = await knex.raw(
    `
    SELECT * FROM posts WHERE "authorId" = ?
  `,
    [userId],
  );
  prime(posts.rows);
  return pickOne("id")(posts.rows);
};
