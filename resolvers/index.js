const { posts } = require("./fake-data");
const { users } = require("./fake-data");

module.exports = {
  users: () => {
    return users.map((u) => ({
      ...u,
      posts: posts.filter((p) => p.createdBy === u.id),
    }));
  },
  posts: () => {
    return posts.map((p) => {
      console.log(p);
      return {
        ...p,
        createdBy: users.find((u) => u.id === p.createdBy),
      };
    });
  },
};
