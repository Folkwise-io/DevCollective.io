const { posts } = require("./fake-data");
const { pickOne } = require("./utils");
const DataLoader = require("dataloader");

const postLoader = new DataLoader(async (ids) =>
  posts.filter((post) => ids.indexOf(post.id) >= 0)
);

module.exports = {
  getPostFieldById: async (id, fieldName) => {
    const post = await postLoader.load(id);
    if (!post) {
      return null;
    }
    return post[fieldName];
  },
  getPostIdsForUserId: async (authorId) =>
    posts.filter((p) => p.createdBy === authorId).map(pickOne("id")),
  getPostIdsForCommunityId: async (communityId) =>
    posts.filter((p) => p.community === communityId).map(pickOne("id")),
  getAllPostIds: async () => posts.map((p) => p.id),
};
