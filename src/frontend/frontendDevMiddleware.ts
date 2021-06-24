import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { Express } from "express";
import fs from "fs";
import path from "path";
// @ts-ignore
import reactRefresh from "react-refresh/babel";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const frontendDevMiddleware = (app: Express) => {
  const hmrPlugin = new webpack.HotModuleReplacementPlugin();
  const webpackOpts: webpack.Configuration = {
    target: `web`, // if in production, use "browserslist" instead
    entry: {
      main: [`webpack-hot-middleware/client?reload=true`, path.join(__dirname, `src`, `index.jsx`)],
    },
    mode: `development`,
    devtool: `source-map`,
    output: {
      filename: `bundle.js`,
      path: path.join(__dirname, `dist`),
    },
    plugins: [
      hmrPlugin,
      new ReactRefreshWebpackPlugin({
        overlay: true,
        forceEnable: true,
        include: path.join(__dirname, `src`, `index.jsx`),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: [
            `source-map-loader`,
            {
              loader: `babel-loader`,
              options: {
                presets: [`@babel/preset-env`, [`@babel/preset-react`, { runtime: `automatic` }]],
                plugins: [
                  reactRefresh,
                  {
                    name: `@babel/plugin-transform-runtime`,
                    manipulateOptions: (opts: any) => {
                      opts.regenerator = true;
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          test: /\.(scss|sass)$/i,
          use: [`style-loader`, `css-loader`, `sass-loader`],
        },
        {
          test: /\.(css)$/i,
          use: [`style-loader`, `css-loader`],
        },
      ],
    },
    resolve: {
      extensions: [`.js`, `.jsx`, `.ts`, `.tsx`],
    },
  };
  const middlewareOpts = {};
  const compiler = webpack(webpackOpts);
  // @ts-ignore
  app.use(webpackDevMiddleware(compiler, middlewareOpts));
  // @ts-ignore
  app.use(webpackHotMiddleware(compiler));
  app.get(`*`, (req, res) => {
    fs.readFile(path.join(__dirname, `src/index.html`), (err, data) => {
      if (err) {
        return res.sendStatus(500);
      } else {
        return res.header(`content-type`, `text/html`).send(data.toString());
      }
    });
  });
};

export default frontendDevMiddleware;
