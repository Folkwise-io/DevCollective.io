import React, { useState, useContext } from "react";
import PostEditorTray from "../../organisms/PostEditorTray";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { StateContext } from "../../state";

const NewPostFragment = () => {
  const { state, dispatch } = useContext(StateContext);
  const { history } = useHistory();
  const { callsign } = useParams();

  const [submitPost, { data }] = useMutation(
    gql`
      mutation Mutation($communityCallsign: String!, $title: String!, $body: String!, $authorId: String!) {
        createPost(communityCallsign: $communityCallsign, title: $title, body: $body, authorId: $authorId) {
          title
          body
          url
          author
        }
      }
    `,
  );

  const handleSubmit = async ({ title, body }) => {
    const authorId = state?.user?.id;

    if (!authorId) {
      return;
    }

    try {
      const post = await submitPost({
        variables: {
          title,
          body,
          communityCallsign: callsign,
          authorId,
        },
      });

      const { url } = post;

      history.push(url);
    } catch (e) {
      console.error(e);
    }
  };

  return <PostEditorTray headerText="Create post" onSubmit={handleSubmit} />;
};

export default NewPostFragment;
