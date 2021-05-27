import React from "react";
import Header from "../atoms/Header";

const PostCard = ({ post }) => {
  const { id: postId, title, author, community } = post;
  const { id: userId, firstName, lastName } = author;
  const { id: communityId, title: communityTitle } = community;

  return (
    <div>
      <div styles={{ display: "grid", gridAutoFlow: "column" }}>
        <Header>{title}</Header>
        <Header>{title}</Header>
      </div>
    </div>
  );
};

export default PostCard;
