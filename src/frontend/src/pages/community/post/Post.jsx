import { gql, useQuery } from "@apollo/client";
import { useContext } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || ``);
      return !inline && match ? (
        <SyntaxHighlighter style={coldarkDark} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, ``)}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load Post.</div>;

  return (
    <div>
      <div style={{ background: `#3E3E3E`, padding: `1rem` }}>
        <h1>{data.post.title}</h1>
        <ReactMarkdown components={components}>{data.post.body}</ReactMarkdown>
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
