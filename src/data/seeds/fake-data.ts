import faker from "faker";
import communityFactory from "../factories/communityFactory";
import communityUserMixer from "../factories/communityUserFactory";
import postFactory from "../factories/postFactory";
import userFactory from "../factories/userFactory";
import knexProvider from "../knex-provider";

const fill = <T>(num = 0, cb: (i: number) => T): T[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(cb(i));
  }
  return arr;
};

export async function seed(): Promise<void> {
  // clear database
  const knex = await knexProvider();
  await knex("users").del();
  await knex("communities").del();
  await knex("communitiesUsers").del();
  await knex("posts").del();

  const users: DUser[] = [
    {
      id: faker.datatype.uuid(),
      email: "a@a.com",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.", // "password"
      createdAt: new Date("2019-10-15"),
      updatedAt: new Date(),
    },
    ...fill(49, userFactory),
  ];
  const communities = fill(10, () => communityFactory());
  const communitiesUsers = communityUserMixer(communities, users);
  const posts = fill(1000, () => postFactory(users, communities));

  await knex("users").insert(users);
  await knex("communities").insert(communities);
  await knex("communitiesUsers").insert(communitiesUsers);
  await knex("posts").insert(posts);
}
