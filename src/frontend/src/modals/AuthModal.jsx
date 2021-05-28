import React, { useContext, useState, useEffect } from "react";
import { Modal } from "../layouts/Modal";
import { Formik, Field, Form } from "formik";
import Button from "../elements/Button";
import { post } from "../utils/rest-api";
import { StateContext } from "../state";
import $ from "./AuthModal.scss";

export const pages = {
  signup: "SIGNUP",
  signin: "SIGNIN",
};

const AuthModal = ({ onClose, page }) => {
  const { dispatch } = useContext(StateContext);
  const [pageMode, setPageMode] = useState(pages.signin);

  useEffect(() => setPageMode(page), [page]);

  const onSubmit = async (values) => {
    const url = pageMode === pages.signin ? "/auth/login" : "/auth/signup";
    const response = await post(url, values);

    if (response.ok) {
      dispatch({
        type: "setUser",
        payload: response.body,
      });
      onClose();
    } else {
      alert("failed");
    }
  };

  if (pageMode === pages.signup) {
    return (
      <Modal title="Sign Up" onClose={() => onClose()}>
        <div className={$.root}>
          <Formik initialValues={{ firstName: "", lastName: "", email: "", password: "" }} onSubmit={onSubmit}>
            <Form className={$.form}>
              <label htmlFor="firstName" className={$.label}>
                First Name
              </label>
              <Field id="firstName" name="firstName" placeholder="First Name" className={$.input} />
              <label htmlFor="lastName" className={$.label}>
                Last Name
              </label>
              <Field id="lastName" name="lastName" placeholder="Last Name" className={$.input} />
              <label htmlFor="email" className={$.label}>
                Email
              </label>
              <Field id="email" name="email" placeholder="Email" className={$.input} />
              <label htmlFor="password" className={$.label}>
                Password
              </label>
              <Field id="password" name="password" placeholder="Password" className={$.input} />
              <Button type="submit" className={$.submit}>
                Submit
              </Button>
            </Form>
          </Formik>
        </div>
      </Modal>
    );
  } else {
    return (
      <Modal title="Sign In" onClose={() => onClose()}>
        <div className={$.root}>
          <Formik initialValues={{ email: "", password: "" }} onSubmit={onSubmit}>
            <Form className={$.form}>
              <label htmlFor="email" className={$.label}>
                Email
              </label>
              <Field id="email" name="email" placeholder="Email" className={$.input} />
              <label htmlFor="password" className={$.label}>
                Password
              </label>
              <Field id="password" name="password" placeholder="Password" className={$.input} />
              <Button type="submit" className={$.submit}>
                Submit
              </Button>
            </Form>
          </Formik>
        </div>
      </Modal>
    );
  }
};

export default AuthModal;
