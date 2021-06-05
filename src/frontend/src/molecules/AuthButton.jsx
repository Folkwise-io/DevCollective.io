import React, { useContext, useEffect, useState } from "react";

import AuthModal, { pages } from "../modals/AuthModal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";
import Button from "../elements/Button";
  

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

  
  return (
    <div>
      {modalPage && <AuthModal page={modalPage} onClose={() => setModalPage(null)} />}
      {user && (
        <Button onClick={() => signOut()}>
          Sign Out
        </Button>
      )}
      {!user && (
        <>
          <Button onClick={() => setModalPage(pages.signin)}>Sign In</Button>
          <Button onClick={() => setModalPage(pages.signup)}>Sign Up</Button>
        </>
      )}
    </div>
  );
};

export default AuthButton;
