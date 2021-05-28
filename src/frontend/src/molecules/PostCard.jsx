import React from "react";
import $ from "./PostCard.scss";

const PostCard = ({ post }) => {
  debugger;
  const { title, author, community } = post;

  const summaryFragments = [];
  if (author) {
    const fullName = `${author.firstName} ${author.lastName}`;
    summaryFragments.push(<div key={fullName}>{fullName}</div>);
  }
  if (community) {
    const { title } = community;
    fragments.push(<div key={title}>{title}</div>);
  }

  const writableFragments = [];
  for (let i = 0; i < summaryFragments.length; i++) {
    const thisFragment = summaryFragments[i];
    const hasNext = summaryFragments[i + 1];

    writableFragments.push(thisFragment);
    if (hasNext) {
      writableFragments.push(<div key={i}>·</div>);
    }
  }

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
          <div className={$.summary}>{writableFragments}</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
