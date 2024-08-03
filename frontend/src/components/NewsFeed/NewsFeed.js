import React from "react";
import Post from "../Post/Post";
import "./NewsFeed.css";

const NewsFeed = ({userInfo, followingUsersPosts }) => {
  return (
    <div className="news-feed">
      {followingUsersPosts.map((post) => (
        <Post userid={userInfo._id} post={post} />
      ))}
    </div>
  );
};

export default NewsFeed;
