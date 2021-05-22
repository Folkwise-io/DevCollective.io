import faker from "faker";
import knex from "../knex";

const fill = <T>(num = 0, cb: (i: number) => T): T[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(cb(i));
  }
  return arr;
};

const user: () => DUser = () => ({
  id: faker.unique(() => faker.datatype.uuid()),
  email: faker.unique(() => faker.internet.email()),
  passwordHash: "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: faker.date.past(),
  updatedAt: new Date(),
});

const community = (): DCommunity => ({
  id: faker.unique(() => faker.datatype.uuid()),
  title: faker.unique(() => faker.company.companyName()),
  description: faker.company.bs(),
  createdAt: faker.date.past(),
  updatedAt: new Date(),
});

export async function seed(): Promise<void> {
  // clear database
  await knex("users").del();
  await knex("communities").del();
  await knex("communitiesUsers").del();
  await knex("posts").del();

  const communityUser = (
    communities: DCommunity[],
    users: DUser[]
  ): DCommunitiesUsers[] => {
    const communitiesUsers: DCommunitiesUsers[] = [];

    communities.forEach((c) => {
      users.forEach((u) => {
        communitiesUsers.push({
          userId: u.id,
          communityId: c.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    });

    console.log(communitiesUsers);

    return communitiesUsers;
  };

  const post = (users: DUser[], communities: DCommunity[]) => ({
    id: faker.datatype.uuid(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(faker.datatype.number(3)),
    createdAt: faker.datatype.datetime(),
    communityId: faker.random.arrayElement(communities).id,
    authorId: faker.random.arrayElement(users).id,
  });

  const users: DUser[] = [
    {
      id: faker.datatype.uuid(),
      email: "a@a.com",
      firstName: "Amy",
      lastName: "Adams",
      passwordHash:
        "$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.",
      createdAt: new Date("2019-10-15"),
      updatedAt: new Date(),
    },
    ...fill(49, user),
  ];
  const communities = fill(10, () => community());
  const communitiesUsers = communityUser(communities, users);
  const posts = fill(1000, () => post(users, communities));

  await knex("users").insert(users);
  await knex("communities").insert(communities);
  await knex("communitiesUsers").insert(communitiesUsers);
  await knex("posts").insert(posts);
}
