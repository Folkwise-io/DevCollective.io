import React from "react";
import { gql, useQuery } from "@apollo/client";
import PostTray from "../../organisms/PostTray";
import PostEditorTray from "../../organisms/PostEditorTray";
import $ from "./CommunityPage.scss";
import { useParams } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import EditPostFragment from "./EditPostFragment";
import NewPostFragment from "./NewPostFragment";

const CommunityPage = () => {
  const { callsign } = useParams();
  const { loading, error, data } = useQuery(
    gql`
      query Query($callsign: String!) {
        community(callsign: $callsign) {
          title
          description
          posts {
            id
            title
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

  if (loading) {
    return <div>"Loading"</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className={$.root}>
      <div className={$.main}>
        <Switch>
          <Route path="/c/:callsign" exact>
            <PostTray posts={data.community.posts} />
          </Route>
          <Route path="/c/:callsign/new" exact>
            <NewPostFragment />
          </Route>
          <Route path="/c/:callsign/:postId/:postSeoTitle/edit">
            <EditPostFragment />
          </Route>
        </Switch>
      </div>
      <div className={$.sidebar}>
        <div className={$.communityInfo}>
          <div className={$.header}>Community Info</div>
          <div className={$.body}>Stuff about this community</div>
        </div>
        <div className={$.relatedCommunities}>
          <div className={$.header}>Related Communities</div>
          <div className={$.body}>
            Stuff about related communitiesStuff about related communitiesStuff about related communitiesStuff about
            related communitiesStuff about related communitiesStuff about related communities
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
