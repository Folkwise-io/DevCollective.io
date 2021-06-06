import React from "react";
import Card, { CardBody, CardHeader, CardHeaderAction } from "../elements/Card";
import styled from "styled-components";

const ToastCard = styled(Card)`
  height: 6em;
  padding-top: 0;
  padding-bottom: 0;
`;

export const ToastTypes = {
  info: {
    Card: styled(ToastCard)`
      background-color: var(--green-300);

      &:hover {
        background-color: var(--green-200);
      }

      ${CardHeader}, ${CardHeaderAction}, ${CardBody} {
        color: var(--green-800);
      }
    `,
  },
  success: {
    Card: styled(ToastCard)`
      background-color: var(--blue-300);

      &:hover {
        background-color: var(--blue-200);
      }

      ${CardHeader}, ${CardHeaderAction}, ${CardBody} {
        color: var(--blue-800);
      }
    `,
  },
  danger: {
    Card: styled(ToastCard)`
      background-color: var(--red-300);

      &:hover {
        background-color: var(--red-200);
      }

      ${CardHeader}, ${CardHeaderAction}, ${CardBody} {
        color: var(--red-800);
      }
    `,
  },
};

const ToastContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: grid;
  width: fit-content;
  grid-auto-flow: row;
  grid-template-rows: repeat(auto-fill);
  background-color: rgba(0, 0, 0, 0.25);
  padding: 0.5em;
  grid-gap: 0.5em;
`;

const Toasts = ({ toasts = [] }) => {
  return (
    <ToastContainer>
      {toasts.map(({ title, body, type }) => (
        <Toast key={title + body} title={title} body={body} type={type} />
      ))}
    </ToastContainer>
  );
};

const Toast = ({ title, body, type }) => {
  return (
    <type.Card>
      <CardHeader>{title}</CardHeader>
      <CardHeaderAction>Close</CardHeaderAction>
      <CardBody>{body}</CardBody>
    </type.Card>
  );
};

export default Toasts;
