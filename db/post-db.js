const { posts } = require("./fake-data");
const { pick } = require("./utils");

module.exports = {
  getPostIdsForUserId: (userId) => Promise.resolve(posts).then(pick("id")),
  get: (id) => Promise.resolve(posts.find((x) => x.id === id)),
};
