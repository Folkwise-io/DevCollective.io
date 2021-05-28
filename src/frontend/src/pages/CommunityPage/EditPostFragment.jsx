import React from "react";
import PostEditorTray from "../../organisms/PostEditorTray";

const EditPostFragment = () => {
  return <PostEditorTray headerText="Edit post" onSubmit={() => alert(JSON.stringify(val))} />;
};

export default EditPostFragment;
