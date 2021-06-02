import React, { useRef } from "react";

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
    <div ref={overlay} onClick={handleClose}>
      <div>
        <div>
          <div>{title}</div>
          <a ref={closeButton} href="#" onClick={handleClose}>
            Close
          </a>
        </div>
        <div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
