import path from "path";

export default {
  client: "postgresql",
  connection: {
    database: "mintbean_v4_test",
    user: "postgres",
    password: "postgres",
    port: 10801,
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
    directory: "seeds-are-disabled",
  },
};
