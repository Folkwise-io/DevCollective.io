import { useState, useEffect, useContext } from "react";
import { CSSTransition } from 'react-transition-group';

import Card, { CardBody, CardHeader, CardHeaderAction } from "../elements/Card";
import styled, { keyframes, css } from "styled-components";
import { StateContext } from "../state";

// countdown animation does not use transition-group
const countdown = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
  `;

// shared animation style fragment for each type of toast
const countdownStyle = css`
  background-size: 200% 100%;
  animation: ${countdown} 6s linear 250ms;
  animation-fill-mode: forwards;
`;
//import Card, { CardBody, CardHeader, CardHeaderAction } from "../elements/Card";

const ToastCard = styled(Card)`
  height: 6em;
  padding-top: 0;
  padding-bottom: 0;
 
 { /* animation classes for toast enter/exit */}
  &.toast-enter {
    transform: rotateX(90deg);
    transform-origin: 0 top;
  }
  &.toast-enter-active {
    opacity: 1;
    transform: rotateX(0);
    transition: transform 400ms linear;
  }
  &.toast-exit {
    transform: rotateX(0);
    transform-origin: 0 top;
  }
  &.toast-exit-active {
    transform: rotateX(90deg);
    transition: transform 400ms linear;
  }

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

      ${countdownStyle} {
        background-image: linear-gradient(90deg, var(--green-300) 50%, var(--green-600) 50%);
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
        color: var(--blue-900);
      }

      ${countdownStyle} {
        background-image: linear-gradient(90deg, var(--blue-300) 50%, var(--blue-600) 50%);
      };
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

      ${countdownStyle} {
        background-image: linear-gradient(90deg, var(--red-300) 50%, var(--red-600) 50%);
      };
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
  const { state } = useContext(StateContext);
  return (
    <ToastContainer>
      {toasts.filter(toast => state.toast.includes(toast.title)).map(({ title, body, type }) => (
        <Toast key={title + body} title={title} body={body} type={type} />
      ))}
    </ToastContainer>
  );

};

const Toast = ({ title, body, type }) => {
  const [show, setShow] = useState(false);
  const { dispatch } = useContext(StateContext);
  let timer;

  useEffect( () => {
    setShow(true);                   // activate enter animation on mount
    return () => {                   // clean up timer and state on unmount
        clearTimeout(timer);         
        unmount();
      }  
    }, []
  );

  // sets timer to 6 seconds before automatic close
  const startCountdown = () => {
    timer = setTimeout(() => setShow(false), 6000);
  };

  // clears state after component unmounts
  const unmount = () => {
    dispatch({
      type: `unmountToast`,
      payload: title
    })
  };

  return (
    <CSSTransition 
      in={show}
      timeout={400} 
      classNames='toast'
      onEntered={() => startCountdown()}
      onExited={() => unmount()}
      unmountOnExit
      >
      <type.Card >
        <CardHeader>{title}</CardHeader>
        <CardHeaderAction onClick={() => setShow(false)}>Close</CardHeaderAction>
        <CardBody>{body}</CardBody>
      </type.Card>
    </CSSTransition>
  );
};

export default Toasts;
