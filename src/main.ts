import appFactory from "./appFactory";
const app = appFactory();
app.listen(8080, () => console.log("Started on port 8080"));
