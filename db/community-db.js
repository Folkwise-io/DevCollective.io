const { communities } = require("./fake-data");
const { pickOne } = require("./utils");
const DataLoader = require("dataloader");

const communityLoader = new DataLoader(async (ids) =>
  communities.filter((community) => ids.indexOf(community.id) >= 0)
);

module.exports = {
  getCommunityFieldById: async (id, fieldName) => {
    const community = await communityLoader.load(id);
    if (!community) {
      return null;
    }
    return community[fieldName];
  },
  getAllCommunityIds: () => Promise.resolve(communities).then(pickOne("id")),
};
