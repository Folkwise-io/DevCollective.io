import React, { useContext, useState, useEffect } from "react";
import $ from "./AuthButton.scss";
import AuthModal from "../modals/AuthModal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";

const AuthButton = () => {
  const { state, dispatch } = useContext(StateContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
    <div className={$.root}>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {user && (
        <a href="#" onClick={() => signOut()} className={$.text}>
          Sign Out
        </a>
      )}
      {!user && (
        <a href="#" onClick={() => setShowAuthModal(true)} className={$.text}>
          Sign In
        </a>
      )}
    </div>
  );
};

export default AuthButton;
