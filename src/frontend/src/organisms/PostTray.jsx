import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";

import Button from "../elements/Button";
import Card, { CardBody } from "../elements/Card";
import PostCard from "../molecules/PostCard";

const Wrapper = styled.div`
  display: grid;
  grid-template: 1fr auto / auto;
  grid-gap: 1rem;
`;

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Wrapper>
      <Card style={{ gridRow: `1`, width: `inherit` }}>
        <CardBody>
          <Button onClick={() => history.push(`/c/${callsign}/new`)}>New Post</Button>
        </CardBody>
      </Card>
      <Card style={{ gridRow: `none` }}>
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
