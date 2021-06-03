import appFactory from "./appFactory";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";
import { AddressInfo } from "net";

const app = appFactory();
frontendDevMiddleware(app);
const server = app.listen(8080, () => {
  const port = (server.address() as AddressInfo)?.port;
  console.log(`Started on port ${port}`);
});
