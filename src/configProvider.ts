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
  MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE: number;
  SENDGRID_KEY: string;
  SENDGRID_PRINT_ONLY: boolean;
  MB_AUTO_OPEN_BROWSER: boolean;
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
      SENDGRID_KEY: getConfig("SENDGRID_KEY"),
      MB_ENABLE_GRAPHQL_LOGGER: getConfig("MB_ENABLE_GRAPHQL_LOGGER", (val) => val === "true"),
      MB_ENABLE_GRAPHIQL: getConfig("MB_ENABLE_GRAPHIQL", (val) => val === "true"),
      SENDGRID_PRINT_ONLY: getConfig("SENDGRID_PRINT_ONLY", (val) => val === "true"),
      MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE: getConfig("MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE", (val) => +val),
      MB_AUTO_OPEN_BROWSER: getConfig("MB_AUTO_OPEN_BROWSER", (val) => val === "true"),
    };
  }

  return instance;
};
