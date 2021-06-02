import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  const { title, author, community, url } = post;

  const summaryFragments = [];
  if (author) {
    const fullName = `${author.firstName} ${author.lastName}`;
    summaryFragments.push(<div key={fullName}>{fullName}</div>);
  }
  if (community) {
    // const { title } = community;
    // fragments.push(<div key={title}>{title}</div>);
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
    <div>
      <div>
        <div>&lt;3</div>
        <div>29</div>
      </div>
      <div>
        <Link to={url}>{title}</Link>
        <div>
          <div>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quasi quo, excepturi animi exercitationem eaque
            cum impedit voluptates nemo praesentium dicta veniam. A reiciendis veniam provident sint porro. Quod, non
            illo?
          </div>
          <div>{writableFragments}</div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
