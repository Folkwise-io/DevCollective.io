import React from "react";
import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import styled from "styled-components";

import NavBar, { NavbarHeight } from "../organisms/NavBar";
import CommunityPage from "../pages/CommunityPage";

const Container = styled.div`
  padding-top: ${NavbarHeight};
`;

const App = () => {
  return (
    <Router>
      <Container>
        <NavBar />
        <Switch>
          <Route path="/" exact>
            {/* Temporarily redirect to community page */}
            <Redirect to="/c/mintbean" />
          </Route>
          <Route
            path="/c/:callsign"
            component={({ location }) => {
              if (location.pathname.indexOf(`/c/mintbean`) !== 0) {
                return <Redirect to="/c/mintbean" />;
              } else {
                return <CommunityPage />;
              }
            }}
          />
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
