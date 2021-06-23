import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import ReactDOM from "react-dom";

import App from "./layouts/App";
import { StateProvider } from "./state";

import "./global.scss";

const client = new ApolloClient({
  uri: `http://localhost:8080/graphql`,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <StateProvider>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StateProvider>,
  document.getElementById(`root`),
);
