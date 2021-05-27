import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import CommunityPage from "../pages/CommunityPage";
import $ from "./App.scss";
import AuthModal from "../modals/AuthModal";

export default () => {
  const [showAuthModal, setShowAuthModal] = useState(true);
  return (
    <Router>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)}></AuthModal>}
      <div className={$.root}>
        <div className={$.header}>
          <div className={$.headerContent}>
            <div className={$.logo}>
              <Link to="/">DevCollective.io</Link>
            </div>
            <a href="#" onClick={() => setShowAuthModal(true)}>
              <div>Sign In</div>
            </a>
          </div>
        </div>
        <div className={$.body}>
          <Switch>
            <Route path="/" exact>
              {/* Temporary redirect to community page */}
              <Redirect to="/c/1" />
            </Route>
            <Route path="/c/:id">
              <CommunityPage />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
};
