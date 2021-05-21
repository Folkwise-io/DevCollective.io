const { communities } = require("./fake-data");
const { pickOne } = require("./utils");

module.exports = {
  list: () => Promise.resolve(communities).then(pick("id")),
  get: (id) => Promise.resolve(communities.find((x) => x.id === id)),
  getCommunityFieldById: async (id, fieldName) => {
    const community = await Promise.resolve(
      communities.find((x) => x.id === id)
    );
    if (!community) {
      return null;
    }
    return community[fieldName];
  },
  getAllCommunityIds: () => Promise.resolve(communities).then(pickOne("id")),
};
