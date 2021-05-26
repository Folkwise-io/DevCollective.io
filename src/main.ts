import appFactory from "./appFactory";
import frontendDevMiddleware from "./frontend/frontendDevMiddleware";

const app = appFactory();
frontendDevMiddleware(app);
app.listen(8080, () => console.log("Started on port 8080"));
