import faker from "faker";

const fill = <T>(num = 0, cb: (i: number) => T): T[] => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(cb(i));
  }
  return arr;
};

export type TUser = ReturnType<typeof user>;
const user = () => ({
  id: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: faker.date.past(),
});

export type TCommunity = ReturnType<typeof community>;
const community = (users: TUser[]) => ({
  id: faker.datatype.uuid(),
  title: faker.company.companyName(),
  description: faker.company.bs(),
  createdAt: faker.datatype.datetime(),
  createdBy: faker.random.arrayElement(users).id,
});

export type TPost = ReturnType<typeof post>;
const post = (users: TUser[], communities: TCommunity[]) => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  commentCount: faker.datatype.number(100),
  upvoteCount: faker.datatype.number(100),
  createdAt: faker.datatype.datetime(),
  createdBy: faker.random.arrayElement(users).id,
  community: faker.random.arrayElement(communities).id,
});

export const users = fill(50, user);
export const communities = fill(10, () => community(users));
export const posts = fill(1000, () => post(users, communities));
