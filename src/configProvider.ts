import { config } from "dotenv";
import path from "path";

const getConfig = (key: string): string => {
  const val = process.env[key];
  if (!val) {
    throw new Error(`Config [${key}] not set in env vars!`);
  } else {
    return val;
  }
};

interface ConfigInstance {
  MB_KNEXFILE: string;
  MB_SESSION_KEY: string;
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
    };
  }

  return instance;
};
