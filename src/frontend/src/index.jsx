import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CommunityPage from "./pages/CommunityPage";
import App from "./layouts/App";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App></App>
  </ApolloProvider>,
  document.getElementById("out"),
);
