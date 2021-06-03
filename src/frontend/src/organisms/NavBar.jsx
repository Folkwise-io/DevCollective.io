import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AuthButton from "../molecules/AuthButton";

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  background: var(--space-900);
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--space-500);
`;

const Logo = styled.span`
  font-size: 2em;
  color: var(--brand-400);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
`;

const NavBar = () => {
  return (
    <Container>
      <Logo>
        <Link to="/" style={{ textDecoration: "inherit", color: "inherit" }}>
          DevCollective.io
        </Link>
      </Logo>
      <AuthButton />
    </Container>
  );
};

export default NavBar;
