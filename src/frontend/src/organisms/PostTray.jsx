import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../elements/Button";
import PostCard from "../molecules/PostCard";
import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr auto / 1fr;
  grid-gap: 1rem;
`;

const PostWrapper = styled.div``;

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Wrapper>
      <PostWrapper>
        <div style={{ float: "left" }}>New Posts</div>
        <Button style={{ float: "right" }} onClick={() => history.push(`/c/${callsign}/new`)}>
          New Post
        </Button>
      </PostWrapper>
      <PostWrapper>
        {posts.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </PostWrapper>
    </Wrapper>
  );
};

export default PostTray;
