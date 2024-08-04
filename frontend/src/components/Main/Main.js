import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";
import axios from "axios";
import NewsFeed from "../NewsFeed/NewsFeed";
import Sidebar from "../Navbar/Sidebar";
import CreatePost from "../Overlays/CreatePost";
import SearchPeople from "../Overlays/SearchPeople";

function Main({ setIsAuth }) {


  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearchPeople, setShowSearchPeople] = useState(false);


  const handleCloseOverlay = () => {
    console.log(showCreatePost);
    setShowCreatePost(false);
  };

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    _id: "",
    fullName: "",
    username: "",
    followers: [],
    following: [],
    posts: [],
    highlights: [],
  });

  const [followingUsersPosts, setFollowingUsersPosts] = useState([]);

  const headersList = {
    Accept: "*/*",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const reqOptions = {
          url: "http://localhost:5000/api/auth/refetch",
          method: "GET",
          headers: headersList,
          withCredentials: true,
        };
        const response = await axios.request(reqOptions);
        setUserInfo(response.data);

        // Fetch posts from all followed users
        const postsPromises = response.data.following.map((userId) => {
          const userReqOptions = {
            url: `http://localhost:5000/api/post/user/${userId}`,
            method: "GET",
            headers: headersList,
            withCredentials: true,
          };
          return axios.request(userReqOptions);
        });

        const postsResponses = await Promise.all(postsPromises);
        const allPosts = postsResponses.flatMap((res) => res.data.posts);
        setFollowingUsersPosts(allPosts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", { withCredentials: true });
      setIsAuth(false);
      navigate('/');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="profile-main">
      {showCreatePost && <CreatePost setShowCreatePost={setShowCreatePost} userId={userInfo._id}/>}
      {showSearchPeople && <SearchPeople setShowSearchPeople={setShowSearchPeople} />}
      <Sidebar userInfo={userInfo} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>
      <NewsFeed userInfo={userInfo} followingUsersPosts={followingUsersPosts} />
    </div>
  );
}

export default Main;
