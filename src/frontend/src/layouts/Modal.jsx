import React, { useRef } from "react";
import styled from "styled-components";
import Card, { CardHeader } from "../elements/Card";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background-color: rgba(0, 0, 0, 70%);
`;

const Body = styled(Card)`
  margin: auto auto;
`;

export const Modal = ({ title, children, onClose }) => {
  const overlay = useRef();
  const closeButton = useRef();

  const handleClose = (e) => {
    if (e.target === overlay.current || e.target === closeButton.current) {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <Overlay ref={overlay} onClick={handleClose}>
      <Body>
        <div>
          <CardHeader>{title}</CardHeader>
          <a ref={closeButton} href="#" onClick={handleClose}>
            Close
          </a>
        </div>
        <div>
          <div>{children}</div>
        </div>
      </Body>
    </Overlay>
  );
};
