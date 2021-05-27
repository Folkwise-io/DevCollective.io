import React from "react";
import { Modal } from "../layouts/Modal";
import { Formik, Field, Form } from "formik";
import Button from "../elements/Button";

const AuthModal = ({ onClose }) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values) => {
    console.log(values);
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
