import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Header from "./atoms/Header";
import { gql, useQuery, ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

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
      }
    }
  `);

  if (loading) {
    return <div>"Loading"</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return data.posts.map(({ id, title }) => <Header key={id}>{title}</Header>);
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("out"),
);
