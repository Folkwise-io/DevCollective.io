import React, { useRef } from "react";
import $ from "./Modal.scss";

export const Modal = ({ title, children, onClose }) => {
  const overlay = useRef();
  const closeButton = useRef();

  const handleClose = (e) => {
    e.preventDefault();
    if (e.target === overlay.current || e.target === closeButton.current) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div className={$.root} ref={overlay} onClick={handleClose}>
      <div className={$.main}>
        <div className={$.header}>
          <div className={$.title}>{title}</div>
          <a className={$.closeButton} ref={closeButton} href="#" onClick={handleClose}>
            Close
          </a>
        </div>
        <div className={$.body}>
          <div className={$.bodyContent}>{children}</div>
        </div>
      </div>
    </div>
  );
};
