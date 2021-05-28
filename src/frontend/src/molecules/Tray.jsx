import React from "react";
import $ from "./Tray.scss";

export const Tray = ({ children }) => <div className={$.root}>{children}</div>;

export const TrayControls = ({ children }) => <div className={$.controls}>{children}</div>;

export const TrayRunway = ({ children }) => <div className={$.runway}>{children}</div>;
