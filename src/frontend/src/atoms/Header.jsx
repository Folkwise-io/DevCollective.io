import React from "react";
import $ from "./Header.scss";

const Header = ({ children }) => <div className={$.header}>{children}</div>;

export default Header;
