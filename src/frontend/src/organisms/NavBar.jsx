import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AuthButton from "../molecules/AuthButton";

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  background: var(--main-color);
  padding: 1rem 2rem;
`;

const Logo = styled.span`
  font-size: 2em;
  color: var(--white);
  font-weight: 600;
`;

const NavBar = () => {
  return (
    <Container>
      <Link to="/">
        <Logo>
          <a>DevCollective.io</a>
        </Logo>
      </Link>
      <AuthButton />
    </Container>
  );
};

export default NavBar;
