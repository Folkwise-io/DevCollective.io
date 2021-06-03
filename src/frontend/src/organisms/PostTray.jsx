import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../elements/Button";
import PostCard from "../molecules/PostCard";
import styled from "styled-components";
import Card, { CardBody } from "../elements/Card";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr auto / auto;
  grid-gap: 1rem;
`;

const LeftButtons = styled.div`
  height: 100%;
  float: left;
  display: grid;
  font-size: 1em;
  font-weight: bold;
`;

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Wrapper>
      <Card style={{ gridRow: "1", width: "100%" }}>
        <CardBody>
          <Button onClick={() => history.push(`/c/${callsign}/new`)}>New Post</Button>
        </CardBody>
      </Card>
      <Card style={{ gridRow: "none" }}>
        <CardBody>
          {posts.map((post) => {
            return <PostCard post={post} key={post.id} />;
          })}
        </CardBody>
      </Card>
    </Wrapper>
  );
};

export default PostTray;
