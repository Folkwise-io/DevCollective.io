import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import CommunityPage from "../pages/CommunityPage";
import $ from "./App.scss";
import AuthModal from "../modals/AuthModal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";

const App = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { state, dispatch } = useContext(StateContext);
  const { user } = state;

  useEffect(async () => {
    const response = await post("/auth/check");
    if (response.ok) {
      dispatch({
        type: "setUser",
        payload: response.body,
      });
    }
  }, []);

  const signOut = async () => {
    const response = await post("/auth/logout");

    if (response.ok) {
      dispatch({
        type: "unsetUser",
      });
    }
  };

  return (
    <Router>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <div className={$.root}>
        <div className={$.header}>
          <div className={$.headerContent}>
            <div className={$.logo}>
              <Link to="/">DevCollective.io</Link>
            </div>
            {user && (
              <a href="#" onClick={() => signOut()}>
                <div>Sign Out</div>
              </a>
            )}
            {!user && (
              <a href="#" onClick={() => setShowAuthModal(true)}>
                <div>Sign In</div>
              </a>
            )}
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
