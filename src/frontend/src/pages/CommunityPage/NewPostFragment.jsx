import React, { useState } from "react";
import PostEditorTray from "../../organisms/PostEditorTray";
import { useParams } from "react-router-dom";

const NewPostFragment = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { callsign } = useParams();

  return <PostEditorTray value={body} onChange={(val) => setBody(val)} />;
};

export default NewPostFragment;
