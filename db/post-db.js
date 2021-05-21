const { posts } = require("./fake-data");
const { pickOne } = require("./utils");

module.exports = {
  getPostIdsForUserId: (userId) =>
    Promise.resolve(posts.filter((p) => p.author === userId)).then(
      pickOne("id")
    ),
  getPostFieldById: async (id, fieldName) => {
    const post = await Promise.resolve(posts.find((x) => x.id === id));
    if (!post) {
      return null;
    }
    return post[fieldName];
  },
  get: (id) => Promise.resolve(posts.find((x) => x.id === id)),
};
