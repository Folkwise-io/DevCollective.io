import { gql, useQuery } from "@apollo/client";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

import { StateContext } from "../../../state";
import Comment from "./Comment";

const Post = () => {
  const { postId } = useParams();
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
          comments {
            id
            body
          }
        }
      }
    `,
    {
      variables: {
        id: postId,
      },
    },
  );

  const user = useContext(StateContext).state.user;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load Post.</div>;

  return (
    <div>
      <div style={{ background: `#3E3E3E`, padding: `1rem` }}>
        <h1>{data.post.title}</h1>
        <ReactMarkdown>{data.post.body}</ReactMarkdown>
        <div>
          <span>
            by {data.post.author.firstName} {data.post.author.lastName} at {data.post.createdAt}
          </span>
          {data.post.author.id === user.id && <span>edit</span>}
        </div>
      </div>
      <div style={{ background: `#3E3E3E`, padding: `1rem` }}>
        {data.post.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default Post;
