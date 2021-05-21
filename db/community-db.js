const { communities } = require("./fake-data");
const { pick } = require("./utils");

module.exports = {
  list: (options) => Promise.resolve(communities).then(pick(...fields)),
};
