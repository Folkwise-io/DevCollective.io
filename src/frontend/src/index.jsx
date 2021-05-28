import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import CommunityPage from "./pages/CommunityPage";
import App from "./layouts/App";
import { StateProvider } from "./state";

const client = new ApolloClient({
  uri: "http://localhost:8080/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <StateProvider>
    <ApolloProvider client={client}>
      <App></App>
    </ApolloProvider>
  </StateProvider>,
  document.getElementById("out"),
);
