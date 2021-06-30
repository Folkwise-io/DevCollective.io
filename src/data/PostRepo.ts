import DataLoader from "dataloader";

import knexProvider from "./knex-provider";
import { fieldGetterHoc, pickOne } from "./utils";

export const postLoader = new DataLoader<string, DPost>(async (ids) => {
  return await knexProvider().then((knex) => knex<DPost>(`posts`).whereIn(`id`, ids));
});

const prime = (posts: DPost[]) => {
  posts.forEach((p: DPost) => {
    // TODO: Straighten up types so that "" + is not required
    postLoader.prime(`` + p.id, p);
  });
  return pickOne(`id`)(posts);
};

export const getPostFieldById = fieldGetterHoc((id) => postLoader.load(id));

export const getPostIdsForCommunityId = async (communityId: number) => {
  const knex = await knexProvider();
  const posts = await knex(`posts`).where({
    communityId,
  });
  prime(posts);
  return pickOne(`id`)(posts);
};

export const getAllPostIds = async () => {
  const knex = await knexProvider();
  const posts = await knex.raw(`select * from posts`);
  prime(posts.rows);
  return pickOne(`id`)(posts.rows);
};

export const getPostIdsForUserId = async (userId: number) => {
  const knex = await knexProvider();
  const posts = await knex.raw(
    `
    SELECT * FROM posts WHERE "authorId" = ?
  `,
    [userId],
  );
  prime(posts.rows);
  return pickOne(`id`)(posts.rows);
};

export const getPostById = async (id: string) => postLoader.load(id);

interface CreatePostParams {
  title: string;
  body: string;
  communityId: number;
  authorId: number;
}
export const createPost = async (params: CreatePostParams): Promise<DPost | void> => {
  const knex = await knexProvider();
  const posts: DPost[] = (await knex<DPost>(`posts`).insert(params).returning(`*`)) as any;
  if (posts && posts.length) {
    posts.forEach((p) => {
      getPostById;
      postLoader.prime(`` + p.id, p);
    });
    return posts[0];
  }
};
