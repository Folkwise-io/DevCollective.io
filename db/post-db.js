const { posts } = require("./fake-data");
const { pickOne } = require("./utils");

module.exports = {
  getPostFieldById: async (id, fieldName) => {
    const post = await Promise.resolve(posts.find((x) => x.id === id));
    if (!post) {
      return null;
    }
    return post[fieldName];
  },
  getPostIdsForUserId: (authorId) =>
    Promise.resolve(posts.filter((p) => p.createdBy === authorId)).then(
      pickOne("id")
    ),
  getPostIdsForCommunityId: (communityId) =>
    Promise.resolve(posts.filter((p) => p.community === communityId)).then(
      pickOne("id")
    ),
  getAllPostIds: () => Promise.resolve(posts.map((p) => p.id)),
};
