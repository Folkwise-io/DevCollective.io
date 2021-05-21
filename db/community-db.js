const { communities } = require("./fake-data");
const { pick } = require("./utils");

module.exports = {
  list: () => Promise.resolve(communities).then(pick("id")),
  get: (id) => Promise.resolve(communities.find((x) => x.id === id)),
};
