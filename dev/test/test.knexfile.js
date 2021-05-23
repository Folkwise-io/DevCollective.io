const path = require("path");

module.exports = {
  client: "postgresql",
  connection: {
    database: "mintbean_v4_test",
    user: "mintbean",
    password: "password",
    port: 10800,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations_test",
    directory: path.join(__dirname, "../../src/data/migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "../../src/data/seeds"),
  },
};
