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

const post = (users) => ({
  id: faker.datatype.uuid(),
  title: faker.lorem.sentence(),
  commentCount: faker.datatype.number(100),
  upvoteCount: faker.datatype.number(100),
  createdAt: faker.datatype.datetime(),
  createdBy: faker.random.arrayElement(users).id,
});

const users = fill(5, user);
const posts = fill(100, () => post(users));

module.exports = {
  users,
  posts,
};
