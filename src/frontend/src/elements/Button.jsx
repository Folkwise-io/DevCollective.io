import React from "react";
import $ from "./Button.scss";

const Button = ({ children, className, ...props }) => {
  return (
    <button className={$.root} {...props}>
      {children}
    </button>
  );
};

export default Button;
