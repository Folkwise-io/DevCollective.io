import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../elements/Button";
import PostCard from "../molecules/PostCard";
import styled from "styled-components";
import Card from "../elements/Card";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr auto / 1fr;
  grid-gap: 1rem;
`;

const LeftButtons = styled.div`
  height: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1em;
  font-weight: bold;
`;

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Wrapper>
      <Card>
        <LeftButtons>New Posts</LeftButtons>
        <Button style={{ float: "right" }} onClick={() => history.push(`/c/${callsign}/new`)}>
          New Post
        </Button>
      </Card>
      <Card>
        {posts.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </Card>
    </Wrapper>
  );
};

export default PostTray;
