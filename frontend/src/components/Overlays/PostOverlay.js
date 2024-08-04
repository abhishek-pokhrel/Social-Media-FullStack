import React from "react";

function PostOverlay() {
  return (
    <div className="overlay">
      <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
        <div className="overlay-image">
          <img
            src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop"
            alt=""
          />
        </div>
        <div className="overlay-details">
          <div className="r1">
            <div className="post-header-info">
              <div className="post-header-avatar">
                <img src={profilePicture} />
              </div>
              <div className="r1-2">
                <div className="post-header-username-info">
                  <p className="post-header-username">{username}</p>
                  <p className="post-header-caption">
                    {overlayPost.post.caption}
                  </p>
                </div>
                <p>{timeDiff}</p>
              </div>
            </div>
            <div className="comments-container">
              {comments.comments &&
                comments.comments.map((comment, index) => (
                  <div className="comment-container">
                    <p
                      onClick={() => {
                        navigate(`/${comment.user._id}`);
                        resetState();
                      }}
                    >
                      <b>{comment.user.username}</b>
                    </p>
                    <li key={index}>{comment.text}</li>
                  </div>
                ))}
            </div>
          </div>
          <div className="r2">
            <div className="overlay-action">
              <button onClick={handleLikeClick} className="add-like-button">
                <img src={isLiked ? liked : like} />
              </button>
              <button className="add-comment-button">
                <img src={comment} />
              </button>
            </div>
            <div className="overlay-stats">
              <p>Liked by {likes} people</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostOverlay;
