import styled from "styled-components";

const Button = styled.button`
  outline: none;
  background-color: var(--blue-400);
  border: none;
  padding: 10px;
  font: 1.2em;
  cursor: pointer;
  box-shadow: 0px 2px 10px 2px var(--space-400);

  &:hover {
    background-color: var(--blue-300);
    box-shadow: 0px 2px 10px 2px var(--space-300);
  }
`;

export default Button;
