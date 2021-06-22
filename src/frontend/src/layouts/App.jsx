import { Redirect, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import styled from "styled-components";

import NavBar, { NavbarHeight } from "../organisms/NavBar";
import CommunityHomepage from "../pages/community/Homepage";

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
          <Route path="/c/:callsign">
            <CommunityHomepage />
          </Route>
        </Switch>
      </Container>
    </Router>
  );
};

export default App;
