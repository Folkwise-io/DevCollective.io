const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { buildSchema } = require("graphql");
const { mergeSchemas } = require("graphql-tools");

// read + build all the schemas in this folder
const schemas = glob
  .sync(__dirname + "/**/*.graphql")
  .map((val) => fs.readFileSync(path.resolve(__dirname, val), "utf-8"))
  .map((val) => buildSchema(val));

// merge the schemas
const mergedSchemas = mergeSchemas({
  schemas,
  throwOnConflict: true,
});

module.exports = mergedSchemas;
