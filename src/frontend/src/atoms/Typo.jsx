/** @jsx jsx */
import React from "react";
import { jsx, css, useTheme } from "@emotion/react";

/**
 *
 * @param {{type: keyof FrontendTheme}} param0
 * @returns
 */
const Typo = (props) => {
  console.log(props);
  const { type, children } = props;
  const theme = useTheme();
  const opts = theme.text[type];

  if (!opts) {
    throw new Error(`Unknown Typo type ${type} received.`);
  }

  const { color, fontSize, fontWeight } = opts;
  console.log(opts);

  return (
    <div
      css={css`
        font-size: ${fontSize};
        color: ${color};
        font-weight: ${fontWeight};
      `}
    >
      {children}
    </div>
  );
};

export default Typo;
