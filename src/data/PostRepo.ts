import { fieldGetterHoc, pickOne } from "./utils";
import DataLoader from "dataloader";
import knexProvider from "./knex-provider";

const postLoader = new DataLoader<string, DPost>(async (ids) =>
  // @ts-ignore
  knexProvider().then((knex) => knex.raw<DPost>("select * from posts where id in (?)", ids)),
);

const prime = (posts: DPost[]) => {
  posts.forEach((p: DPost) => {
    postLoader.prime(p.id, p);
  });
  return pickOne("id")(posts);
};

export const getPostFieldById = fieldGetterHoc((id) => postLoader.load(id));

export const getPostIdsForCommunityId = async (communityId: string) => {
  const knex = await knexProvider();
  const posts = await knex("posts").where({
    communityId,
  });
  prime(posts);
  return pickOne("id")(posts);
};

export const getAllPostIds = async () => {
  const knex = await knexProvider();
  const posts = await knex.raw("select * from posts");
  prime(posts.rows);
  return pickOne("id")(posts.rows);
};

export const getPostIdsForUserId = async (userId: string) => {
  const knex = await knexProvider();
  const posts = await knex.raw(
    `
    SELECT * FROM posts WHERE "authorId" = ?
  `,
    [userId],
  );
  prime(posts.rows);
  return pickOne("id")(posts.rows);
};

export const createPost = async (title: string, body: string, communityId: string): Promise<{ id: string }> => {
  const knex = await knexProvider();
  return knex<DPost>("posts")
    .insert({
      communityId,
      title,
      body,
    })
    .returning("id");
};
