import React from "react";
import CommunityPage from "../pages/CommunityPage";
import $ from "./App.scss";

export default () => {
  return (
    <div className={$.root}>
      <div className={$.header}>
        <div className={$.headerContent}>
          <div className={$.logo}>DevCollective.io</div>
          <div className={$.signIn}>
            <div>Sign In</div>
          </div>
        </div>
      </div>
      <div className={$.body}>
        <CommunityPage />
      </div>
    </div>
  );
};
