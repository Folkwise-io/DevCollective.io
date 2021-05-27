import React from "react";
import $ from "./PostTray.scss";
import PostCard from "../molecules/PostCard";
import Button from "../elements/Button";

const PostTray = ({ posts }) => {
  return (
    <div className={$.root}>
      <div className={$.controls}>
        <div className={$.tabs}>
          <div>Hot</div>
          <div>New</div>
        </div>
        <Button>New Post</Button>
      </div>
      <div className={$.runway}>
        {posts.map((post) => {
          return <PostCard post={post} key={post.id} />;
        })}
      </div>
    </div>
  );
};

export default PostTray;
