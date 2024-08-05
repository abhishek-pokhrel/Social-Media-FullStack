import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import profilePicture from './picture.jpg';
import Sidebar from '../Navbar/Sidebar';
import like from './like.png';
import liked from './liked.png';
import comment from './comment.png';
import CreatePost from '../Overlays/CreatePost';
import SearchPeople from '../Overlays/SearchPeople';


function Profile({setShowCreatePost, setShowSearchPeople, showCreatePost, showSearchPeople}) {

  const [username, setUsername] = useState(''); 

  const resetState = () => {
    setIsLiked(null);
    setLikes(null);
    setTimeDiff(null);
    setComments([]);

    setIsMine(false);
    setMyAllPosts([]);
    setUserAllPosts([]);

    setMyInfo({
      _id: "",
      fullName: "",
      username: "",
      followers: [],
      following: [],
      posts: [],
      highlights: [],
    })

    setUserInfo({
      _id: "",
      fullName: "",
      username: "",
      followers: [],
      following: [],
      posts: [],
      highlights: [],
      isPrivate: '',
    })

    setIsFollowing(false);
    setOverlayPost(null);
  }

  const navigate = useNavigate();

  const calculateTimeDifference = (overlayPost) => {
    const createdAt = overlayPost.post.createdAt;
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

  const [isLiked, setIsLiked] = useState(null);
  const [likes, setLikes] = useState(null);
  const [postImage, setPostImage] = useState(`http://localhost:5000/uploads/defaultPost.png`);
  const [timeDiff, setTimeDiff] = useState(null);
  const [comments, setComments] = useState([]);

  

  const handleLikeClick = async () => {
    const postId = overlayPost.post._id;
    const url = isLiked
      ? `http://localhost:5000/api/post/dislike/${postId}`
      : `http://localhost:5000/api/post/like/${postId}`;
    const method = 'POST';
    const body = JSON.stringify({ userId: myInfo._id });
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

  const { profileId } = useParams();
  const [isMine, setIsMine] = useState(false);
  const [myAllPosts, setMyAllPosts] = useState([]);
  const [userAllPosts, setUserAllPosts] = useState([]);
  const [myInfo, setMyInfo] = useState({
    _id: "",
    fullName: "",
    username: "",
    followers: [],
    following: [],
    posts: [],
    highlights: [],
  });
  const [userInfo, setUserInfo] = useState({
    _id: "",
    fullName: "",
    username: "",
    followers: [],
    following: [],
    posts: [],
    highlights: [],
    isPrivate: '',
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [overlayPost, setOverlayPost] = useState(null);

  

  const headersList = { Accept: "*/*" };

  const handleOverlay = async (post) => {
    console.log(post);
    const commentsAPI = `http://localhost:5000/api/comment/post/${post.post._id}`;
    const userAPI = `http://localhost:5000/api/user/${post.post.user}`;
  
    setTimeDiff(calculateTimeDifference(post));
    setIsLiked(post.post.likes.includes(myInfo._id));
    setLikes(post.post.likes.length);
    setPostImage(post.post.image[0])
    setOverlayPost(post);
  
    try {
      // Fetch comments
      const commentsResponse = await axios.get(commentsAPI, { withCredentials: true });
      setComments(commentsResponse.data);
      console.log(commentsResponse.data);
  
      // Fetch user info
      const userResponse = await axios.get(userAPI, { withCredentials: true });
      setUsername(userResponse.data.username);
      console.log(userResponse.data);
    } catch (error) {
      console.error('Error fetching comments or user data:', error);
    }
  };
  

  const handleOverlayClose = () => {
    console.log(overlayPost);
    console.log(username);
    setOverlayPost(null);
  };

  const handleFollowAction = async () => {
    const apiUrl = isFollowing
      ? `http://localhost:5000/api/user/unfollow/${userInfo._id}`
      : `http://localhost:5000/api/user/follow/${userInfo._id}`;
    try {
      const response = await axios.post(apiUrl, { _id: myInfo._id }, { withCredentials: true });
      setIsFollowing(!isFollowing);
      const updatedFollowers = isFollowing
        ? userInfo.followers.filter(id => id !== myInfo._id)
        : [...userInfo.followers, myInfo._id];
      setUserInfo({ ...userInfo, followers: updatedFollowers });
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqOptionsRefetch = {
          url: "http://localhost:5000/api/auth/refetch",
          method: "GET",
          headers: headersList,
          withCredentials: true,
        };

        const myResponse = await axios.request(reqOptionsRefetch);
        setMyInfo(myResponse.data);

        const postsPromises = myResponse.data.posts.map((post) => {
          const userReqOptions = {
            url: `http://localhost:5000/api/post/${post}`,
            method: "GET",
            headers: headersList,
            withCredentials: true,
          };
          return axios.request(userReqOptions);
        });

        const postsResponses = await Promise.all(postsPromises);
        const myPosts = postsResponses.map((res) => res.data);
        setMyAllPosts(myPosts.reverse());

        const reqOptions = {
          url: `http://localhost:5000/api/user/${profileId}`,
          method: "GET",
          headers: headersList,
          withCredentials: true,
        };

        const userResponse = await axios.request(reqOptions);
        setUserInfo(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [profileId]);

  useEffect(() => {
    const fetchData = async () => {
      if (profileId && myInfo._id) {
        if (profileId === myInfo._id) {
          setIsMine(true);
        } else {
          setIsMine(false);

          const postsPromises = userInfo.posts.map((post) => {
            const userReqOptions = {
              url: `http://localhost:5000/api/post/${post}`,
              method: "GET",
              headers: headersList,
              withCredentials: true,
            };
            return axios.request(userReqOptions);
          });

          const postsResponses = await Promise.all(postsPromises);
          const userPosts = postsResponses.map((res) => res.data);
          setUserAllPosts(userPosts.reverse());
          console.log(userAllPosts)
        }
      }
    };

    fetchData();
    if(userInfo.followers.includes(myInfo._id)){
      setIsFollowing(true)
    } else { setIsFollowing(false) }
    
  }, [profileId, myInfo, userInfo.posts]);

  return (
    <>
    {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} userId={userInfo._id}/>}
    {showSearchPeople && <SearchPeople setShowSearchPeople={setShowSearchPeople} />}
      {isMine ? (
        <>
          <Sidebar userInfo={myInfo} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>
          <header>
            <div className="container">
              <div className="profile">
                <div className="profile-image">
                  <img src={profilePicture} alt="" />
                </div>
                <div className="profile-user-settings">
                  <h1 className="profile-user-name">{myInfo.username}</h1>
                  <button className="btn profile-edit-btn">Edit Profile</button>
                  <button className="btn profile-settings-btn" aria-label="profile settings">
                    <i className="fas fa-cog" aria-hidden="true" />
                  </button>
                </div>
                <div className="profile-stats">
                  <ul>
                    <li>
                      <span className="profile-stat-count">{myInfo.posts.length}</span> posts
                    </li>
                    <li>
                      <span className="profile-stat-count">{myInfo.followers.length}</span> followers
                    </li>
                    <li>
                      <span className="profile-stat-count">{myInfo.following.length}</span> following
                    </li>
                  </ul>
                </div>
                <div className="profile-bio">
                  <p>
                    <span className="profile-real-name">{myInfo.fullName}</span> {myInfo.bio}
                  </p>
                </div>
              </div>
            </div>
          </header>
          <hr />
          <main>
            <div className="container">
              <div className="gallery">
                {myAllPosts.length > 0 ? (
                  myAllPosts.map((post, index) => (
                    <div className="gallery-item" tabIndex={0} key={index} onClick={() => handleOverlay(post)}>
                      <img
                        src={`http://` + post.post.image[0]}
                        className="gallery-image"
                        alt="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop"
                      />
                      <div className="gallery-item-info">
                        <ul>
                          <li className="gallery-item-likes">
                            <span className="visually-hidden">Likes:</span>
                            <i className="fas fa-heart" aria-hidden="true" /> {post.post.likes.length}
                          </li>
                          <li className="gallery-item-comments">
                            <span className="visually-hidden">Comments</span>
                            <i className="fas fa-comment" aria-hidden="true" /> {post.post.comments.length}
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No posts to display</p>
                )}
              </div>
              
            </div>
          </main>
        </>
      ) : (
        userInfo.isPrivate[0] === false ? (
          <>
          <Sidebar userInfo={myInfo} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>
            <header>
              <div className="container">
                <div className="profile">
                  <div className="profile-image">
                    <img src={profilePicture} alt="" />
                  </div>
                  <div className="profile-user-settings">
                    <h1 className="profile-user-name">{userInfo.username}</h1>
                    <button onClick={handleFollowAction} className={isFollowing ? 'following-button' : 'follow-button'}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="btn profile-message-btn">Message</button>
                    <button className="btn profile-settings-btn" aria-label="profile settings">
                      <i className="fas fa-cog" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="profile-stats">
                    <ul>
                      <li>
                        <span className="profile-stat-count">{userInfo.posts.length}</span> posts
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.followers.length}</span> followers
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.following.length}</span> following
                      </li>
                    </ul>
                  </div>
                  <div className="profile-bio">
                    <p>
                      <span className="profile-real-name">{userInfo.fullName}</span> {userInfo.bio}
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <hr />
            <main>
              <div className="container">
                <div className="gallery">
                  {userAllPosts.length > 0 ? (
                    userAllPosts.map((post, index) => (
                      <div className="gallery-item" tabIndex={0} key={index} onClick={() => handleOverlay(post)}>
                        <img
                          src={`http://` + post.post.image[0]}
                          className="gallery-image"
                          alt=""
                        />
                        <div className="gallery-item-info">
                          <ul>
                            <li className="gallery-item-likes">
                              <span className="visually-hidden">Likes:</span>
                              <i className="fas fa-heart" aria-hidden="true" /> {post.post.likes.length}
                            </li>
                            <li className="gallery-item-comments">
                              <span className="visually-hidden">Comments</span>
                              <i className="fas fa-comment" aria-hidden="true" /> {post.post.comments.length}
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No posts to display</p>
                  )}
                </div>
              </div>
            </main>
          </>
        ) : userInfo.followers.includes(myInfo._id) ? (
          <>
            <Sidebar userInfo={myInfo} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>
            <header>
              <div className="container">
                <div className="profile">
                  <div className="profile-image">
                    <img src={profilePicture} alt="" />
                  </div>
                  <div className="profile-user-settings">
                    <h1 className="profile-user-name">{userInfo.username}</h1>
                    <button onClick={handleFollowAction} className={isFollowing ? 'following-button' : 'follow-button'}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="btn profile-message-btn">Message</button>
                    <button className="btn profile-settings-btn" aria-label="profile settings">
                      <i className="fas fa-cog" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="profile-stats">
                    <ul>
                      <li>
                        <span className="profile-stat-count">{userInfo.posts.length}</span> posts
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.followers.length}</span> followers
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.following.length}</span> following
                      </li>
                    </ul>
                  </div>
                  <div className="profile-bio">
                    <p>
                      <span className="profile-real-name">{userInfo.fullName}</span> {userInfo.bio}
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <hr />
            <main>
              <div className="container">
                <div className="gallery">
                  {userAllPosts.length > 0 ? (
                    userAllPosts.map((post, index) => (
                      <div className="gallery-item" tabIndex={0} key={index} onClick={() => handleOverlay(post)}>
                        <img
                          src={`http://` + post.post.image[0]}
                          className="gallery-image"
                          alt="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop"
                        />
                        <div className="gallery-item-info">
                          <ul>
                            <li className="gallery-item-likes">
                              <span className="visually-hidden">Likes:</span>
                              <i className="fas fa-heart" aria-hidden="true" /> {post.post.likes.length}
                            </li>
                            <li className="gallery-item-comments">
                              <span className="visually-hidden">Comments</span>
                              <i className="fas fa-comment" aria-hidden="true" /> {post.post.comments.length}
                            </li>
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No posts to display</p>
                  )}
                </div>
              </div>
            </main>
          </>
        ) : (
          <>
          <Sidebar userInfo={myInfo} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>
            <header>
              <div className="container">
                <div className="profile">
                  <div className="profile-image">
                    <img src={profilePicture} alt="" />
                  </div>
                  <div className="profile-user-settings">
                    <h1 className="profile-user-name">{userInfo.username}</h1>
                    <button onClick={handleFollowAction} className={isFollowing ? 'following-button' : 'follow-button'}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="btn profile-message-btn">Message</button>
                    <button className="btn profile-settings-btn" aria-label="profile settings">
                      <i className="fas fa-cog" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="profile-stats">
                    <ul>
                      <li>
                        <span className="profile-stat-count">{userInfo.posts.length}</span> posts
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.followers.length}</span> followers
                      </li>
                      <li>
                        <span className="profile-stat-count">{userInfo.following.length}</span> following
                      </li>
                    </ul>
                  </div>
                  <div className="profile-bio">
                    <p>
                      <span className="profile-real-name">{userInfo.fullName}</span> {userInfo.bio}
                    </p>
                  </div>
                </div>
              </div>
            </header>
            <main>
              <div className="container">
                <div className="gallery">
                  <div>
                    <h1>This Account is Private</h1>
                    <h4>Follow this account to see their posts.</h4>
                  </div>
                </div>
              </div>
            </main>
          </>
        )
      )}

      {overlayPost && (
        <div className="overlay" onClick={handleOverlayClose}>
          
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <div className="overlay-image">
              <img src={`http://` + postImage} alt="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop" />
            </div>
            <div className="overlay-details">

              <div className='r1'>
                <div className='post-header-info'>
                  <div className='post-header-avatar'><img src={profilePicture} /></div>
                  <div className='r1-2'>
                    <div className='post-header-username-info'>
                    <p className='post-header-username'>{username}</p>
                    <p className='post-header-caption'>{overlayPost.post.caption}</p>
                    </div>
                    <p>{timeDiff}</p>
                  </div>
                </div>
                <div className='comments-container'>
                {comments.comments && comments.comments.map((comment, index) => (

                  <div className='comment-container'>
                  <p onClick={()=> 
                    {navigate(`/${comment.user._id}`)
                    resetState();
                    }}><b>{comment.user.username}</b></p>
      <li key={index}>{comment.text}</li>
      </div>
    ))}
                </div>
              </div>
              <div className='r2'>
              <div className="overlay-action">
                <button onClick={handleLikeClick} className='add-like-button'><img src={isLiked ? liked : like}/></button>
                <button className='add-comment-button'><img src={comment}/></button>
              </div>
              <div className="overlay-stats">
                <p>Liked by {likes} people</p>
              </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;