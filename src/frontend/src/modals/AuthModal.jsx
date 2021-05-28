import React, { useContext, useState } from "react";
import { Modal } from "../layouts/Modal";
import { Formik, Field, Form } from "formik";
import Button from "../elements/Button";
import { post } from "../utils/rest-api";
import { StateContext } from "../state";
import $ from "./AuthModal.scss";

const pages = {
  signup: "SIGNUP",
  signin: "SIGNIN",
};

const AuthModal = ({ onClose, openWithSignup = false }) => {
  const { dispatch } = useContext(StateContext);
  const [page, setPage] = useState(pages.signup);

  useEffect(() => {
    setPage(openWithSignup ? pages.signup : pages.signin);
  }, [openWithSignup]);

  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    const response = await post("/auth/login", values);

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

  if (pages.signup) {
    return (
      <Modal title="Sign Up" onClose={() => onClose()}>
        <div className={$.root}>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form className={$.form}>
              <label htmlFor="email" className={$.label}>
                Email
              </label>
              <Field id="email" name="email" placeholder="Email" className={$.input} />
              <label htmlFor="password" classname={$.label}>
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
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form className={$.form}>
              <label htmlFor="email" className={$.label}>
                Email
              </label>
              <Field id="email" name="email" placeholder="Email" className={$.input} />
              <label htmlFor="password" classname={$.label}>
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
