import React from "react";
import "./Header.scss";

const Header = ({ children }) => {
  return (
    <div className="header">
      <div className="something">OK</div>
      {children}
    </div>
  );
};

export default Header;
