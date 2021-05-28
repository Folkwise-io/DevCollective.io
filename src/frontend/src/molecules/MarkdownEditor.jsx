import React from "react";
import $ from "./MarkdownEditor.scss";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/theme/midnight.css";

const MarkdownEditor = ({ value, onBeforeChange }) => {
  return (
    <CodeMirror
      value={value}
      options={{
        mode: "markdown",
        lineNumbers: false,
        theme: "midnight",
        lineWrapping: true,
      }}
      onBeforeChange={(editor, data, value) => {
        onBeforeChange(value);
      }}
      // onChange={(editor, data, value) => {}}
    />
  );
};

export default MarkdownEditor;
