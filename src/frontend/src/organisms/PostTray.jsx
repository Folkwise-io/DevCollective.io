import React from "react";
import $ from "./PostTray.scss";
import PostCard from "../molecules/PostCard";

const PostTray = ({ posts }) => {
  return (
    <div className={$.root}>
      <div className={$.controls}>
        <div className={$.tabs}>
          <div>Hot</div>
          <div>New</div>
        </div>
        <div className={$.newPostButton}>New Post</div>
      </div>
      <div className={$.runway}>
        {posts.map((post) => {
          return (
            <div>
              <PostCard post={post} key={post.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PostTray;
