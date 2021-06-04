import React, { useContext, useEffect, useState } from "react";

import AuthModal, { pages } from "../modals/AuthModal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";

const AuthButton = () => {
  const { state, dispatch } = useContext(StateContext);
  const [modalPage, setModalPage] = useState(null);
  const { user } = state;

  useEffect(() => {
    (async () => {
      const response = await post(`/auth/check`);
      if (response.ok) {
        dispatch({
          type: `setUser`,
          payload: response.body,
        });
      }
    })();
  }, [dispatch]);

  const signOut = async () => {
    const response = await post(`/auth/logout`);

    if (response.ok) {
      dispatch({
        type: `unsetUser`,
      });
    }
  };

  const btn = "btn btn-outline-secondary m-1"

  return (
    <div>
      {modalPage && <AuthModal page={modalPage} onClose={() => setModalPage(null)} />}
      {user && (
        <a className={btn} href="#" onClick={() => signOut()}>
          Sign Out
        </a>
      )}
      {!user && (
        <>
          <a className={btn} href="#" onClick={() => setModalPage(pages.signin)}>
            Sign In
          </a>
          <a className={btn} href="#" onClick={() => setModalPage(pages.signup)}>
            Sign Up
          </a>
        </>
      )}
    </div>
  );
};

export default AuthButton;
