import React, { useContext, useState, useEffect } from "react";
import $ from "./AuthButton.scss";
import AuthModal, { pages } from "../modals/AuthModal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";

const AuthButton = () => {
  const { state, dispatch } = useContext(StateContext);
  const [modalPage, setModalPage] = useState(null);
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
      {modalPage && <AuthModal page={modalPage} onClose={() => setModalPage(null)} />}
      {user && (
        <a href="#" onClick={() => signOut()} className={$.text}>
          Sign Out
        </a>
      )}
      {!user && (
        <>
          <a href="#" onClick={() => setModalPage(pages.signin)} className={$.text}>
            Sign In
          </a>
          <a href="#" onClick={() => setModalPage(pages.signup)} className={$.text}>
            Sign Up
          </a>
        </>
      )}
    </div>
  );
};

export default AuthButton;
