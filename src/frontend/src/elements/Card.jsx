import styled from "styled-components";

const Card = styled.div`
  background-color: var(--space-800);
  border: 1px solid var(--space-900);
  box-shadow: 0px 2px 10px 2px var(--space-600);
  border-radius: 3px;
  padding: 1rem;
  height: fit-content;
  width: fit-content;
  display: grid;
  grid-template:
    [header-row] "header action" [header-row-end]
    [body-row] "body body" [body-row-end]
    / auto 1fr;

  &:hover {
    background-color: var(--space-700);
    box-shadow: 0px 2px 10px 2px var(--space-500);
  }
`;

export const CardHeader = styled.div`
  font-size: 1.4em;
  color: var(--brand-300);
  grid-area: header;
  align-self: center;
`;

export const CardHeaderAction = styled.div`
  height: fit-content;
  width: fit-content;
  grid-area: action;
  justify-self: end;
  align-self: center;
`;

export const CardBody = styled.div`
  grid-area: body;
`;

export default Card;
