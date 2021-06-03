import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Heart = styled.div`
  grid-area: heart;
  padding: 0 20px;
  color: var(--red-500);
`;

const Title = styled.div`
  grid-area: title;
  padding: 0px 20px;
  font-size: 18px;
  font-weight: bold;

  & a {
    text-decoration: none;
  }
`;

// row 2

const LikeCount = styled.div`
  grid-area: like-count;
  padding: 0 20px;
  color: var(--space-200);
  font-weight: bold;
`;

const Preview = styled.div`
  grid-area: preview;
  font-size: 14px;
  color: var(--space-200);
  padding: 0px 20px;
`;

// row 3

const Spacer = styled.div`
  padding: 0 20px;
`;

const Summary = styled.div`
  grid-area: summary;
  padding: 0px 20px;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template:
    [row1-start] "heart title" auto [row1-end]
    [row2-start] "like-count preview" auto [row2-end]
    [row3-start] ". summary" auto [row3-end]
    / auto 1fr;

  &:nth-child(even) {
    background-color: var(--space-700);
  }
  background-color: var(--space-600);
  cursor: pointer;
`;

const PostCard = ({ post }) => {
  const { title, author, community, url } = post;
  const history = useHistory();

  const summaryFragments = [];
  if (author) {
    const fullName = `${author.firstName} ${author.lastName}`;
    summaryFragments.push(<div key={fullName}>{fullName}</div>);
  }
  if (community) {
    // const { title } = community;
    // fragments.push(<div key={title}>{title}</div>);
  }

  const writableFragments = [];
  for (let i = 0; i < summaryFragments.length; i++) {
    const thisFragment = summaryFragments[i];
    const hasNext = summaryFragments[i + 1];

    writableFragments.push(thisFragment);
    if (hasNext) {
      writableFragments.push(<div key={i}>·</div>);
    }
  }

  return (
    <Wrapper onClick={() => history.push(url)}>
      <Heart>&lt;3</Heart>
      <LikeCount>29</LikeCount>
      <Title>
        <Link to={url}>{title}</Link>
      </Title>
      <Preview>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi quo, excepturi animi exercitationem eaque cum
        impedit voluptates nemo praesentium dicta veniam. A reiciendis veniam provident sint porro. Quod, non illo?
      </Preview>
      <Spacer />
      <Summary>{writableFragments}</Summary>
    </Wrapper>
  );
};

export default PostCard;
