import { Field, Form, Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";

import Button from "../elements/Button";
import { Modal } from "../layouts/Modal";
import { StateContext } from "../state";
import { post } from "../utils/rest-api";
import styled from "styled-components";

const FormWrapper = styled.div`
  form {
    display: grid;
    overflow: hidden;
  }
  input {
    padding: 1em;
    outline: none;
    width: 100%;
    border: none;

    &:focus {
      outline: none;
    }
  }
`;

const SigninFormWrapper = styled(FormWrapper)`
  form {
    grid-template:
      [row2-start] "email" [row2-end]
      [row3-start] "password" [row3-end]
      [row4-start] "submit" [row4-end]
      / 1fr;
    grid-gap: 1em;
  }
`;

const SignupFormWrapper = styled(FormWrapper)`
  form {
    grid-template:
      [row1-start] "firstName lastName" auto [row1-end]
      [row2-start] "email email" [row2-end]
      [row3-start] "password password" [row3-end]
      [row4-start] "submit submit" [row4-end]
      / 1fr 1fr;
    grid-gap: 1em;
  }
`;



const makeField = ({ label, id, type = "input" }) => (
  <label htmlFor={id} style={{ gridArea: id }}>
      {label}
    <Field id={id} name={id} type={type} placeholder={label} />
  </label>
);

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
        <SignupFormWrapper>
          <Formik initialValues={{ firstName: ``, lastName: ``, email: ``, password: `` }} onSubmit={onSubmit}>
            <Form>
              {makeField({ id: "firstName", label: "First Name" })}
              {makeField({ id: "lastName", label: "Last Name" })}
              {makeField({ id: "email", label: "Email" })}
              {makeField({ id: "password", label: "Password", type: "password" })}
              <Button type="submit" style={{ gridArea: "submit" }}>
                Submit
              </Button>
            </Form>
          </Formik>
        </SignupFormWrapper>
      </Modal>
    );
  } else {
    return (
      <Modal title="Sign In" onClose={() => onClose()}>
        <SigninFormWrapper>
          <Formik initialValues={{ email: ``, password: `` }} onSubmit={onSubmit}>
            <Form>
              {makeField({ id: "email", label: "Email" })}
              {makeField({ id: "password", label: "Password", type: "password" })}
              <Button type="submit">Submit</Button>
            </Form>
          </Formik>
        </SigninFormWrapper>
      </Modal>
    );
  }
};

export default AuthModal;
