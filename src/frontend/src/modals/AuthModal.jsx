import React from "react";
import { Modal } from "../layouts/Modal";

export default ({ onClose }) => {
  return (
    <Modal title="Sign In" onClose={() => onClose()}>
      Test
    </Modal>
  );
};
