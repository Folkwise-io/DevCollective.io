import React, { useState } from "react";
import $ from "./PostEditorTray.scss";
import { Tray, TrayControls, TrayRunway } from "../molecules/Tray";
import Button from "../elements/Button";
import MarkdownEditor from "../molecules/MarkdownEditor";

const PostEditorTray = ({ value, onChange }) => {
  return (
    <Tray>
      <TrayControls>
        <Button style={{ float: "right" }}>Submit</Button>
      </TrayControls>
      <TrayRunway>
        <div className={$.editorWrapper}>
          <MarkdownEditor
            value={value}
            onBeforeChange={(value) => {
              onChange(value);
            }}
          />
        </div>
      </TrayRunway>
    </Tray>
  );
};

export default PostEditorTray;
