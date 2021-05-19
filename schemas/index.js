const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");

// monoschema for now
const schemaFile = fs.readFileSync(
  path.resolve(__dirname, "schema.graphql"),
  "utf-8"
);

const schema = buildSchema(schemaFile);

module.exports = schema;
