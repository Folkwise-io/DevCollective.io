import React, { useState } from "react";
import PostEditorTray from "../../organisms/PostEditorTray";
import { useParams } from "react-router-dom";

const NewPostFragment = () => {
  const { callsign } = useParams();

  return <PostEditorTray headerText="Create post" onSubmit={(val) => console.log(val)} />;
};

export default NewPostFragment;
