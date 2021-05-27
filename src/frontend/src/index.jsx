import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { gql, useQuery, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import PostCard from "./molecules/PostCard";
import PostTray from "./organisms/PostTray";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  const { loading, error, data } = useQuery(gql`
    query Query {
      posts {
        id
        title
        community {
          id
          title
        }
        author {
          id
          firstName
          lastName
        }
      }
    }
  `);

  if (loading) {
    return <div>"Loading"</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return <PostTray posts={data.posts} />;
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("out"),
);
