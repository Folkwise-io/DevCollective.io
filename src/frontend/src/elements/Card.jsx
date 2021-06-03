import styled from "styled-components";

const Card = styled.div`
  background-color: var(--space-800);
  border: 1px solid var(--space-900);
  box-shadow: 0px 2px 10px 2px var(--space-500);
  border-radius: 3px;
  padding: 1rem;

  &:hover {
    background-color: var(--space-700);
    box-shadow: 0px 2px 10px 2px var(--space-400);
  }
`;

export default Card;
