import { config } from "dotenv";
import path from "path";

type Mapper<T> = (x: string) => T;
const defaultMapper: Mapper<string> = (x) => x;

function getConfig(key: string): string;
function getConfig<T>(key: string, mapper: Mapper<T>): T;
function getConfig(key: string, mapper = defaultMapper): any {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Config [${key}] not set in env vars!`);
  } else {
    return mapper(val);
  }
}

interface ConfigInstance {
  MB_KNEXFILE: string;
  MB_SESSION_KEY: string;
  MB_ENABLE_GRAPHQL_LOGGER: boolean;
  MB_ENABLE_GRAPHIQL: boolean;
}
let instance: ConfigInstance;

export default () => {
  if (!instance) {
    const envFilePath = getConfig("MB_ENV_FILE");

    config({
      path: path.join(__dirname, "..", envFilePath),
    });

    instance = {
      MB_KNEXFILE: getConfig("MB_KNEXFILE"),
      MB_SESSION_KEY: getConfig("MB_SESSION_KEY"),
      MB_ENABLE_GRAPHQL_LOGGER: getConfig("MB_ENABLE_GRAPHQL_LOGGER", (val) => val === "true"),
      MB_ENABLE_GRAPHIQL: getConfig("MB_ENABLE_GRAPHIQL", (val) => val === "true"),
    };
  }

  return instance;
};
