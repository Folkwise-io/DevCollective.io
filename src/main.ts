import { AddressInfo } from "net";

import appFactory from "./appFactory";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";

const app = appFactory();
frontendDevMiddleware(app);
const server = app.listen(8080, () => {
  const port = (server.address() as AddressInfo)?.port;
  console.info(`Started on port ${port}`);
});
