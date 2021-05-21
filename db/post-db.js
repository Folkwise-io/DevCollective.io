const { posts } = require("./fake-data");
const { pick } = require("./utils");

module.exports = {
  list: (options) => Promise.resolve(posts).then(pick(...fields)),
};
