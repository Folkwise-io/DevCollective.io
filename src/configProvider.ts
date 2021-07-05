import { config, parse } from "dotenv";
import fs from "fs";
import path from "path";
import * as yup from 'yup';

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

const instanceSchema = yup.object().shape({
  MB_KNEXFILE: yup.string().required(),
  MB_SESSION_KEY: yup.string().required(),
  MB_ENABLE_GRAPHQL_LOGGER: yup.bool().required(),
  MB_ENABLE_GRAPHIQL: yup.bool().required(),
  MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE: yup.number().required(),
  SENDGRID_KEY: yup.string().required(),
  SENDGRID_PRINT_ONLY: yup.bool().required(),
  PORT: yup.number().required(),
}).required();

let instance : yup.InferType<typeof instanceSchema>;

export default () => {
  if (!instance) {
    const envFilePath = getConfig(`MB_ENV_FILE`);

    const overrideEnvFilePath = getConfig(`MB_ENV_FILE_OVR`);

    config({
      path: path.join(__dirname, `..`, envFilePath),
    });

    // checks to see if the dev-overrides.env file is present in root directory
    if (fs.existsSync(path.join(__dirname, `..`, overrideEnvFilePath))) {
      // override
      const envConfig = parse(fs.readFileSync(path.join(__dirname, `..`, overrideEnvFilePath)));

      for (const key in envConfig) {
        process.env[key] = envConfig[key];
      }
    }
    
    instance = instanceSchema.cast({
      MB_KNEXFILE: getConfig(`MB_KNEXFILE`),
      MB_SESSION_KEY: getConfig(`MB_SESSION_KEY`),
      SENDGRID_KEY: getConfig(`SENDGRID_KEY`),
      MB_ENABLE_GRAPHQL_LOGGER: getConfig(`MB_ENABLE_GRAPHQL_LOGGER`),
      MB_ENABLE_GRAPHIQL: getConfig(`MB_ENABLE_GRAPHIQL`),
      SENDGRID_PRINT_ONLY: getConfig(`SENDGRID_PRINT_ONLY`),
      MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE: getConfig(`MB_FORGOT_PASSWORD_TOKEN_DAYS_TO_LIVE`),
      PORT: getConfig(`PORT`),
    });

    try {
      instanceSchema.validate(instance);
    } catch (err) {
      console.error(err.errors);
    }
  }

  return instance;
};
