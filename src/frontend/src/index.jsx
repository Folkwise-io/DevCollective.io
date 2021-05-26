/** @jsx jsx */
import React from "react";
import ReactDOM from "react-dom";
import { jsx, css } from "@emotion/react";

ReactDOM.render(
  <div
    css={css`
      color: hotpink;
    `}
  >
    Hello, World
  </div>,
  document.getElementById("out"),
);
