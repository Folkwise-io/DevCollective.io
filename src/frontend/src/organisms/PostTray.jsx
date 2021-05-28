import React from "react";
import $ from "./PostTray.scss";
import PostCard from "../molecules/PostCard";
import Button from "../elements/Button";
import { Tray, TrayControls, TrayRunway } from "../molecules/Tray";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

const PostTray = ({ posts }) => {
  const history = useHistory();

  const { callsign } = useParams();

  return (
    <Tray>
      <TrayControls>
        <div className={$.controls}>
          <div className={$.tabs}>
            {/* <div>Hot</div> */}
            <div>New Posts</div>
          </div>
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
