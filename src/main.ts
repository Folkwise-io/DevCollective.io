import appFactory from "./appFactory";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";
import open from "open";
import { AddressInfo } from "net";
import configProvider from "./configProvider";
const { MB_AUTO_OPEN_BROWSER } = configProvider();

const app = appFactory();
frontendDevMiddleware(app);
const server = app.listen(8080, () => {
  const port = (server.address() as AddressInfo)?.port;
  console.log(`Started on port ${port}`);
  if (MB_AUTO_OPEN_BROWSER) {
    open(`http://localhost:${port}`);
  }
});
