import { Field, Form, Formik } from "formik";
import React from "react";

import Button from "../elements/Button";
import MarkdownEditor from "../molecules/MarkdownEditor";
import { Tray, TrayControls, TrayRunway } from "../molecules/Tray";

const PostEditorTray = ({ headerText, onSubmit }) => {
  return (
    <Tray>
      <Formik initialValues={{ title: ``, body: `` }} onSubmit={onSubmit}>
        <Form>
          <TrayControls>
            {headerText}
            <Button style={{ float: `right` }} type="submit">
              Submit
            </Button>
          </TrayControls>
          <TrayRunway>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" placeholder="Title" />
            <label htmlFor="body">Body</label>
            <Field name="body" id="body">
              {({ field, form }) => (
                <div>
                  <MarkdownEditor
                    value={field.value}
                    onBeforeChange={(val) => {
                      form.setFieldValue(`body`, val);
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
