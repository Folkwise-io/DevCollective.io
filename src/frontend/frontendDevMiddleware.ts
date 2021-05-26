import { Application } from "express";
import webpack from "webpack";
import path from "path";
import webpackDevMiddleware from "webpack-dev-middleware";
import fs from "fs";

const frontendDevMiddleware = (app: Application) => {
  const webpackOpts: webpack.Configuration = {
    entry: path.join(__dirname, "src"),
    mode: "development",
    devtool: false,
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "dist"),
    },
  };
  const middlewareOpts = {};
  const compiler = webpack(webpackOpts);
  app.use(webpackDevMiddleware(compiler, middlewareOpts));
  app.get("*", (req, res) => {
    fs.readFile(path.join(__dirname, "src/index.html"), (err, data) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        res.header("content-type", "text/html").send(data.toString());
      }
    });
  });
};

export default frontendDevMiddleware;
