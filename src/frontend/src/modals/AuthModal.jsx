import React, { useContext } from "react";
import { Modal } from "../layouts/Modal";
import { Formik, Field, Form } from "formik";
import Button from "../elements/Button";
import { post } from "../utils/rest-api";
import { StateContext } from "../state";
import $ from "./AuthModal.scss";

const AuthModal = ({ onClose }) => {
  const { dispatch } = useContext(StateContext);

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
};

export default AuthModal;
