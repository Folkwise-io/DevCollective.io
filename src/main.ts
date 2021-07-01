import { AddressInfo } from "net";

import appFactory from "./appFactory";
import configProvider from "./configProvider";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";

const { PORT } = configProvider();
const app = appFactory();
frontendDevMiddleware(app);
const server = app.listen(PORT, () => {
  const port = (server.address() as AddressInfo)?.port;
  console.info(`Started on port ${port}`);
});
