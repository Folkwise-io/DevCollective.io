import React from "react";
import $ from "./PostCard.scss";

const PostCard = ({ post }) => {
  const { id: postId, title, author, community } = post;
  const { id: userId, firstName, lastName } = author;
  const { id: communityId, title: communityTitle } = community;

  return (
    <div className={$.root}>
      <div className={$.like}>
        <div className={$.heart}>&lt;3</div>
        <div className={$.likeCount}>29</div>
      </div>
      <div className={$.main}>
        <div className={$.header}>{title}</div>
        <div className={$.body}>
          <div className={$.preview}>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi quo, excepturi animi exercitationem eaque
            cum impedit voluptates nemo praesentium dicta veniam. A reiciendis veniam provident sint porro. Quod, non
            illo?
          </div>
          <div className={$.summary}>
            <div>
              {firstName} {lastName}
            </div>
            <div>·</div>
            <div>{communityTitle}</div>
            <div>·</div>
            <div>36 Comments</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
