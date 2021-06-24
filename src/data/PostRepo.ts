import DataLoader from "dataloader";

import knexProvider from "./knex-provider";
import { fieldGetterHoc, pickOne } from "./utils";

export const postLoader = new DataLoader<string, DPost>((ids) => {
  return knexProvider().then((knex) => knex<DPost>(`posts`).whereIn(`id`, ids));
});

const prime = (posts: DPost[]) => {
  console.log(`PRIME WAS CALLED`);
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

interface EditPostParams {
  title?: string;
  body?: string;
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

export const editPost = async (id: string, params: EditPostParams): Promise<DPost | void> => {
  // TODO: Come up with a better way to handle id conversions in a standard way
  const _id: number = +id;

  console.log(`EDITPOST ID`, _id, params);

  const knex = await knexProvider();
  const posts: DPost[] = (await knex<DPost>(`posts`).where({ id: _id }).update(params).returning(`*`)) as any;

  console.log(`THE EDITED POSTS`, posts);

  if (posts && posts.length) {
    posts.forEach((p) => {
      console.log(`Inside the prime function`, p);
      getPostById;
      postLoader.prime(`` + p.id, p);
    });
    console.log(`Inside the prime function, after the loop`, posts[0]);
    return posts[0];
  }
};
