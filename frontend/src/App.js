import './App.css'
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import axios from "axios";
import Home from "./components/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Main from "./components/Main/Main";
import Profile from './components/Profile/Profile';

const App = () => {
  
  const [isAuth, setIsAuth] = useState(false);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showSearchPeople, setShowSearchPeople] = useState(false);
  
  const handleRefetch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/refetch', { withCredentials: true });
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
    }
  };

  useState(() => {
    handleRefetch()
  }, [])
  

  return (
    <Router>
      <div className="App">
        <Routes>

        <Route path="/:profileId" element={isAuth ? (<Profile showCreatePost={showCreatePost} showSearchPeople={showSearchPeople} setShowCreatePost={setShowCreatePost} setShowSearchPeople={setShowSearchPeople}/>): (<Home />)} />

          <Route path="/" element={isAuth ? (<Main setIsAuth={setIsAuth}/> ): (<Home />)} />

          <Route path="/login" element={ isAuth ? (<Main setIsAuth={setIsAuth}/>) : (<Login setIsAuth={setIsAuth} />) } />

          <Route path="/register" element={ isAuth ? (<Main setIsAuth={setIsAuth}/>) : (<Register setIsAuth={setIsAuth} />) } />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
