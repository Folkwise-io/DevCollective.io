import React, { useContext } from "react";
import { Modal } from "../layouts/Modal";
import { Formik, Field, Form } from "formik";
import Button from "../elements/Button";
import { post } from "../utils/rest-api";
import { StateContext } from "../state";

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
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <label htmlFor="email">Email</label>
          <Field id="email" name="email" placeholder="Email" />
          <label htmlFor="password">Password</label>
          <Field id="password" name="password" placeholder="Password" />
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </Modal>
  );
};

export default AuthModal;
