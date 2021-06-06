import React from "react";
import PostEditorTray from "../../organisms/PostEditorTray";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import ReactMarkdown from "react-markdown";

const ViewPostFragment = () => {
  const { callsign: communityCallsign, postId } = useParams();
  const { loading, error, data } = useQuery(
    gql`
      query Query($id: ID!) {
        post(id: $id) {
          title
          body
          createdAt
          author {
            id
            firstName
            lastName
          }
          community {
            callsign
            title
          }
        }
      }
    `,
    {
      variables: {
        id: postId,
      },
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Failed to load Post.</div>;
  }

  return <ReactMarkdown>{data.post.body}</ReactMarkdown>;
};

export default ViewPostFragment;
