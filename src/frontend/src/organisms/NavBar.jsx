import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AuthButton from "../molecules/AuthButton";

export const NavbarHeight = "70px";

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: ${NavbarHeight};
  padding: 0px 30px;

  display: grid;
  grid-auto-flow: column;
  justify-content: space-between;
  align-items: center;
  background: var(--space-900);
  border-bottom: 1px solid var(--space-500);
  box-shadow: 0px 2px 10px 2px var(--space-500);

  &:hover {
    background-color: var(--space-700);
  }
`;

const Logo = styled.span`
  font-size: 2em;
  color: var(--brand-300);
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
          Dev Collective
        </Link>
      </Logo>
      <AuthButton />
    </Container>
  );
};

export default NavBar;
