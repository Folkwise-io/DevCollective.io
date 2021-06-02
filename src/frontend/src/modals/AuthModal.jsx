import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import Button from "../elements/Button";
import { Modal } from "../layouts/Modal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";

export const pages = {
  signup: `SIGNUP`,
  signin: `SIGNIN`,
};

const AuthModal = ({ onClose, page }) => {
  const { dispatch } = useContext(StateContext);
  const [pageMode, setPageMode] = useState(pages.signin);

  useEffect(() => setPageMode(page), [page]);

  const onSubmit = async (values) => {
    const url = pageMode === pages.signin ? `/auth/login` : `/auth/signup`;
    const response = await post(url, values);

    if (response.ok) {
      dispatch({
        type: `setUser`,
        payload: response.body,
      });
      onClose();
    } else {
      alert(`failed`);
    }
  };

  if (pageMode === pages.signup) {
    return (
      <Modal title="Sign Up" onClose={() => onClose()}>
        <div>
          <Formik initialValues={{ firstName: ``, lastName: ``, email: ``, password: `` }} onSubmit={onSubmit}>
            <Form>
              <label htmlFor="firstName">First Name</label>
              <Field id="firstName" name="firstName" placeholder="First Name" />
              <label htmlFor="lastName">Last Name</label>
              <Field id="lastName" name="lastName" placeholder="Last Name" />
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" placeholder="Email" />
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" placeholder="Password" />
              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal title="Sign In" onClose={() => onClose()}>
        <div>
          <Formik initialValues={{ email: ``, password: `` }} onSubmit={onSubmit}>
            <Form>
              <label htmlFor="email">Email</label>
              <Field id="email" name="email" placeholder="Email" />
              <label htmlFor="password">Password</label>
              <Field id="password" name="password" placeholder="Password" />
              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
        </div>
      </Modal>
    );
  }
};

export default AuthModal;
