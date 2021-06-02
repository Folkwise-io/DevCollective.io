import React from "react";
import { useHistory, useParams } from "react-router-dom";

import Button from "../elements/Button";
import PostCard from "../molecules/PostCard";
import Tray from "../molecules/Tray";
import TrayControls from "../molecules/TrayControls";
import TrayRunway from "../molecules/TrayRunway";

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Tray>
      <TrayControls>
        <div>
          <div>New Posts</div>
          <Button onClick={() => history.push(`/c/${callsign}/new`)}>New Post</Button>
        </div>
      </TrayControls>
      <TrayRunway>
        {posts.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </TrayRunway>
    </Tray>
  );
};

export default PostTray;
