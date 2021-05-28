import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import CommunityPage from "../pages/CommunityPage";
import AuthButton from "../molecules/AuthButton";
import $ from "./App.scss";

const App = () => {
  return (
    <Router>
      <div className={$.root}>
        <div className={$.header}>
          <div className={$.headerContent}>
            <div className={$.logo}>
              <Link to="/" className={$.text}>
                DevCollective.io
              </Link>
            </div>
            <div>
              <AuthButton />
            </div>
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

export default App;
