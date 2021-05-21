const { users } = require("./fake-data");
const { pickOne } = require("./utils");
const DataLoader = require("dataloader");

const userLoader = new DataLoader(async (ids) =>
  users.filter((user) => ids.indexOf(user.id) >= 0)
);

module.exports = {
  getUserFieldById: async (id, fieldName) => {
    const user = await userLoader.load(id);
    if (!user) {
      return null;
    }
    return user[fieldName];
  },
  getAllUserIds: () => Promise.resolve(users).then(pickOne("id")),
};
