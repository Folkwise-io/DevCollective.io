import React, { useState, useContext } from "react";
import PostEditorTray from "../../organisms/PostEditorTray";
import { useParams, useHistory } from "react-router-dom";
import { useMutation, gql } from "@apollo/client";
import { StateContext } from "../../state";

const NewPostFragment = () => {
  const { state, dispatch } = useContext(StateContext);
  const history = useHistory();
  const { callsign } = useParams();

  const [submitPost, { data }] = useMutation(
    gql`
      mutation Mutation($communityCallsign: String!, $title: String!, $body: String!, $authorId: ID!) {
        createPost(communityCallsign: $communityCallsign, title: $title, body: $body, authorId: $authorId) {
          title
          body
          url
        }
      }
    `
  );

  const handleSubmit = async ({ title, body }) => {
    const authorId = state?.user?.id;

    if (!authorId) {
      return;
    }

    try {
      const response = await submitPost({
        variables: {
          title,
          body,
          communityCallsign: callsign,
          authorId,
        },
      });

      const { url } = response.data.createPost;

      history.push(url);
    } catch (e) {
      console.error(e);
      alert("Something went wrong while creating the post.");
    }
  };

  return <PostEditorTray headerText="Create post" onSubmit={handleSubmit} />;
};

export default NewPostFragment;
