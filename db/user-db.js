const { users } = require("./fake-data");
const { pick } = require("./utils");

module.exports = {
  list: (options) => Promise.resolve(users),
};
