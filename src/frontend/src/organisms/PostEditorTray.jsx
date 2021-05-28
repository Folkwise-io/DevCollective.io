import React, { useState } from "react";
import $ from "./PostEditorTray.scss";
import { Tray, TrayControls, TrayRunway } from "../molecules/Tray";
import Button from "../elements/Button";
import MarkdownEditor from "../molecules/MarkdownEditor";

const PostEditorTray = ({}) => {
  const [value, setValue] = useState("");
  return (
    <Tray>
      <TrayControls>
        <Button style={{ float: "right" }}>Submit</Button>
      </TrayControls>
      <TrayRunway>
        <MarkdownEditor
          value={value}
          onBeforeChange={(value) => {
            setValue(value);
          }}
        />
      </TrayRunway>
    </Tray>
  );
};

export default PostEditorTray;
