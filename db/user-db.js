const { users } = require("./fake-data");
const { pickOne } = require("./utils");

module.exports = {
  getUserFieldById: async (id, fieldName) => {
    const user = await Promise.resolve(users.find((x) => x.id === id));
    if (!user) {
      return null;
    }
    return user[fieldName];
  },
  getAllUserIds: () => Promise.resolve(users).then(pickOne("id")),
};
