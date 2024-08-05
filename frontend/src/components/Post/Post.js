import React, { useState, useEffect } from "react";
import "./Post.css";
import profilePicture from './picture.jpg';
import { useNavigate } from "react-router-dom";
import like from '../Profile/like.png'
import liked from '../Profile/liked.png'
import comment from '../Profile/comment.png'
import bookmark from '../Profile/bookmark.png'
import bookmarked from '../Profile/bookmarked.png'


function Post({ userid, post }) {

  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.likes.includes(userid));
  const [likes, setLikes] = useState(post.likes.length);
  const [username, setUsername] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false); // New state for options button

  const handlePostOption = () => {
    setIsOptionsOpen(!isOptionsOpen); // Toggle the state
  }

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${post.user}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchUsername();
  }, [post.user]);

  const handleLikeClick = async () => {
    const postId = post._id;
    const url = isLiked
      ? `http://localhost:5000/api/post/dislike/${postId}`
      : `http://localhost:5000/api/post/like/${postId}`;
    const method = 'POST';
    const body = JSON.stringify({ userId: userid });
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    const credentials = 'include';

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        credentials
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Only update the state if the request was successful
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const calculateTimeDifference = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdAtDate;

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffSeconds < 60) {
      return `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  };

  const timeDiff = calculateTimeDifference(post.createdAt);

  return (
    <div className="post" postId={post._id}>
      <div className="info">
        <div className="user">
          <div className="profile-pic">
            <img src={profilePicture} alt="profile" />
          </div>
          <p className="username" onClick={() => {
            navigate(`/${post.user}`)
          }}>{username}</p>
        </div>
        <button
          className={`post-options ${isOptionsOpen ? 'rotate' : ''}`} // Apply the rotate class conditionally
          onClick={handlePostOption}
        >
          ⚙️
        </button>
      </div>
      <img src={`http://` + post.image[0]} className="post-image" alt="" />
      <div className="post-content">
        <div className="reaction-wrapper">
          <button className="like-button icon" onClick={handleLikeClick}>
            {isLiked ? (<img className="like-button" src={liked} alt="Liked" />) : (<img className="like-button" src={like} alt="Like" />)}
          </button>
          <button className="comment-button-box icon"><img className="comment-button" src={comment} /></button>
          <button onClick={(event)=> {setIsBookmarked(!isBookmarked)}} className="bookmark-button-box icon"><img className="bookmark-button" src={ isBookmarked ? bookmarked : bookmark} /></button>
        </div>
        <p className="likes">{likes} {likes <= 1 ? 'like' : 'likes'}</p>
        <p className="description">
          <span>{username} </span> {post.caption}
        </p>
        <p className="post-time">{timeDiff}</p>
      </div>
      <div className="comment-wrapper">
        <img src="img/smile.PNG" className="icon" alt="" />
        <input type="text" className="comment-box" placeholder="Add a comment" />
        <button className="comment-btn">post</button>
      </div>
    </div>
  );
}

export default Post;
