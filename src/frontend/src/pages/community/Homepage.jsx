import { gql, useQuery } from "@apollo/client";
import { Route, Switch, useParams } from "react-router-dom";
import styled from "styled-components";

import Card, { CardBody, CardHeader } from "../../elements/Card";
import PostTray from "../../organisms/PostTray";
import EditPostFragment from "./EditPostFragment";
import NewPostFragment from "./NewPostFragment";
import Post from "./post/Post";

const Container = styled.div`
  display: grid;
  margin: 0px auto;
  padding: 2rem;
  grid-template: min-content 1fr / 80% 1fr;
  grid-template-areas: "main a" "main b";
  grid-gap: 1rem;
  align-items: start;
`;

const Homepage = () => {
  const { callsign } = useParams();
  const { loading, error, data } = useQuery(
    gql`
      query Query($callsign: String!) {
        community(callsign: $callsign) {
          title
          description
          callsign
          posts {
            id
            title
            url
            author {
              id
              firstName
              lastName
            }
          }
        }
      }
    `,
    {
      variables: {
        callsign: callsign,
      },
    },
  );

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;
  return (
    <Container>
      <div style={{ gridArea: `main` }}>
        <Switch>
          <Route path="/c/:callsign" exact>
            <PostTray posts={data.community.posts} />
          </Route>
          <Route path="/c/:callsign/new" exact>
            <NewPostFragment />
          </Route>
          <Route path="/c/:callsign/:postId-*">
            <Post />
          </Route>
          <Route path="/c/:callsign/:postId/:postSeoTitle/edit">
            <EditPostFragment />
          </Route>
        </Switch>
      </div>
      <Card style={{ gridArea: `a` }}>
        <CardHeader>/c/{data.community.callsign}</CardHeader>
        <CardBody>{data.community.description}</CardBody>
      </Card>
      <Card style={{ gridArea: `b` }}>
        <CardHeader>WARNING - Pre-release</CardHeader>
        <CardBody>
          This app is still in pre-release form. Please expect bugs and, if you find one, I&apos;d appreciate it if you
          reported it to me -- chances are I&apos;m unaware of it. Also, if you&apos;re currently using a version of the
          platform that&apos;s deployed to a server of some sort, your data will be wiped during development every few
          days. Expect a production release in June. -Monarch
        </CardBody>
      </Card>
    </Container>
  );
};

export default Homepage;
