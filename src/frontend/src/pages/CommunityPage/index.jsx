import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import styled from "styled-components";

import PostTray from "../../organisms/PostTray";
import EditPostFragment from "./EditPostFragment";
import NewPostFragment from "./NewPostFragment";
import ViewPostFragment from "./ViewPostFragment";

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

const CardHeader = styled.div`
  font-size: 1.4em;
  color: var(--brand-300);
`;

const Container = styled.div`
  display: grid;
  margin: 0px auto;
  padding: 2rem;
  grid-template: min-content 1fr / 80% 1fr;
  grid-template-areas: "main a" "main b";
  grid-gap: 1rem;
  align-items: start;
`;

const CommunityPage = () => {
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
    }
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
          <Route path="/c/:callsign/:postId/:postSeoTitle">
            <ViewPostFragment />
          </Route>
          <Route path="/c/:callsign/:postId/:postSeoTitle/edit">
            <EditPostFragment />
          </Route>
        </Switch>
      </div>
      <Card style={{ gridArea: `a` }}>
        <CardHeader>/c/{data.community.callsign}</CardHeader>
        <div>{data.community.description}</div>
      </Card>
      <Card style={{ gridArea: `b` }}>
        <CardHeader>WARNING - Pre-release</CardHeader>
        <div>
          This app is still in pre-release form. Please expect bugs and, if you find one, I&apos;d appreciate it if you
          reported it to me -- chances are I&apos;m unaware of it. Also, if you&apos;re currently using a version of the
          platform that&apos;s deployed to a server of some sort, your data will be wiped during development every few
          days. Expect a production release in June. -Monarch
        </div>
      </Card>
    </Container>
  );
};

export default CommunityPage;
