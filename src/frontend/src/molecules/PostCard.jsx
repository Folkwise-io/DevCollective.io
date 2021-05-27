import React from "react";
import Header from "../atoms/Header";

const PostCard = ({ post }) => {
  const { id: postId, title, author, community } = post;
  const { id: userId, firstName, lastName } = author;
  const { id: communityId, title: communityTitle } = community;

  return (
    <div>
      <div style={{ display: "grid" }}>
        <Header>{title}</Header>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ flex: "0 1 auto" }}>
            {firstName} {lastName}
          </div>
          <div style={{ flex: "0 1 auto" }}>{communityTitle}</div>
          <div style={{ flex: "0 1 auto" }}>Test</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
