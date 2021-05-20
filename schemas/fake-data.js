const faker = require("faker");

const fill = (num = 0, cb) => {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(cb(i));
  }
  return arr;
};

const user = () => ({
  id: faker.datatype.uuid(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  createdAt: faker.date.past(),
});

const community = (users) => ({
  id: faker.datatype.uuid(),
  title: faker.company.companyName(),
  description: faker.company.bs(),
  createdAt: faker.datatype.datetime(),
  createdBy: faker.random.arrayElement(users).id,
});

const post = (users, communities) => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  commentCount: faker.datatype.number(100),
  upvoteCount: faker.datatype.number(100),
  createdAt: faker.datatype.datetime(),
  createdBy: faker.random.arrayElement(users).id,
  community: faker.random.arrayElement(communities).id,
});

const users = fill(50, user);
const communities = fill(10, () => community(users));
const posts = fill(1000, () => post(users, communities));

module.exports = {
  users,
  communities,
  posts,
};
