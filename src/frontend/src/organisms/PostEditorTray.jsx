import React, { useState } from "react";
import $ from "./PostEditorTray.scss";
import { Tray, TrayControls, TrayRunway } from "../molecules/Tray";
import Button from "../elements/Button";
import MarkdownEditor from "../molecules/MarkdownEditor";
import { Field, Form, Formik } from "formik";

const PostEditorTray = ({ title, body, headerText, onSubmit }) => {
  return (
    <Tray>
      <Formik initialValues={{ title: title || "", body: body || "" }} onSubmit={onSubmit}>
        <Form className={$.form}>
          <TrayControls>
            {headerText}
            <Button style={{ float: "right" }} type="submit">
              Submit
            </Button>
          </TrayControls>
          <TrayRunway>
            <label htmlFor="title" className={$.label}>
              Title
            </label>
            <Field id="title" name="title" placeholder="Title" className={$.input} />
            <label htmlFor="body" className={$.label}>
              Body
            </label>
            <Field name="body" id="body">
              {({ field, form, meta }) => (
                <div className={$.editorWrapper}>
                  <MarkdownEditor
                    value={field.value}
                    onBeforeChange={(val) => {
                      form.setValues({ body: val });
                    }}
                  />
                </div>
              )}
            </Field>
          </TrayRunway>
        </Form>
      </Formik>
    </Tray>
  );
};

export default PostEditorTray;
