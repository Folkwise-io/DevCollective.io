import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import App from "./layouts/App";
import { StateProvider } from "./state";

import "./global.scss";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <StateProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StateProvider>,
  document.getElementById("out"),
);
