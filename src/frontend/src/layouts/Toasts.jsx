import React, {useState, useEffect} from "react";
import Card, { CardBody, CardHeader, CardHeaderAction } from "../elements/Card";
import styled, {keyframes} from "styled-components";

const slide = keyframes`
  0% {
    background-position: 0 0;
  }
  0% {
    background-position: 100% 0;
  }
  `;

const ToastCard = styled(Card)`
  height: 6em;
  padding-top: 0;
  padding-bottom: 0;
  ${CardHeaderAction} {
    :hover {
      cursor: pointer;
    }
  }

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

    background: linear-gradient(90deg, var(--green-600) 50%, var(--green-300) 50%);
    background-size: 200% 100%;
    background-position: 0 0;
    animation: ${slide} 6s linear 0.5s;
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
  const [show, setShow] = useState(true);
  // close Toast after 7s
  useEffect( () => setTimeout(() => setShow(false), 7000), []);
  

  return (
    show && <type.Card>
      <CardHeader>{title}</CardHeader>
      <CardHeaderAction onClick={() => setShow(false)}>Close</CardHeaderAction>
      <CardBody>{body}</CardBody>
    </type.Card>
  );
};

export default Toasts;
