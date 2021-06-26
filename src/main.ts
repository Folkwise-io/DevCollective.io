import appFactory from "./appFactory";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";
import { AddressInfo } from "net";
import configProvider from "./configProvider";

const { PORT } = configProvider();
const app = appFactory();
frontendDevMiddleware(app);
const server = app.listen(PORT, () => {
  const port = (server.address() as AddressInfo)?.port;
  console.info(`Started on port ${port}`);
});
