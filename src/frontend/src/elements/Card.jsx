import styled from "styled-components";

const Card = styled.div`
  background-color: var(--space-800);
  border: 1px solid var(--space-900);
  box-shadow: 0px 2px 10px 2px var(--space-600);
  border-radius: 3px;
  padding: 1rem;
  height: fit-content;
  width: fit-content;
  grid-area: none;

  &:hover {
    background-color: var(--space-700);
    box-shadow: 0px 2px 10px 2px var(--space-500);
  }
`;

export const CardHeader = styled.div`
  font-size: 1.4em;
  color: var(--brand-300);
`;

export const CardHeaderAction = styled.div`
  height: fit-content;
  width: fit-content;
`;

export const CardBody = styled.div``;

export default Card;
