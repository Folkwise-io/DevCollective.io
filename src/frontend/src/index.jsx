/** @jsx jsx */
import React from "react";
import ReactDOM from "react-dom";
import { jsx, css, ThemeProvider } from "@emotion/react";
import Typo from "./atoms/Typo";
import theme from "./theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Typo type="header">Hello, World</Typo>
  </ThemeProvider>,
  document.getElementById("out"),
);
