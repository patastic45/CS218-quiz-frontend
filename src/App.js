import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegPage from "./Login/Register.js";
import LoginPage from "./Login/Login.js";
import CreateQuizCollection from "./QuizCollections/Create.js";
import ShowCollections from "./QuizCollections/Show.js";
import CreateMFQuiz from "./Quizzes/CreateMFQuiz.js";
import CreateTFQuiz from "./Quizzes/CreateTFQuiz.js";
import ShowQuizzes from "./Quizzes/ShowQuizzes.js";
import ShowAns from "./Answer/ShowAns.js";
import ShowScores from "./Answer/ShowScores.js";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./APICalls/Api";  // Import your logout function

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated by looking for a stored token
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    await logoutUser(); // Call API to logout
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div>
      <h1 className="app-title">Quiz Management System</h1>
      <div className="grid-container">
        {/* User Authentication Section */}
        <div className="grid-box">
          <h2>User Authentication</h2>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn">Logout</button>
          ) : (
            <>
              <Link to="/register">Create User</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </div>
        
        {/* Box 2: Create Quiz Collection */}
        <div className="grid-box">
          <h2>Quiz Collections</h2>
          <Link to="/create-collection">Create Quiz Collection</Link>
          <Link to="/show-collections">Show Collections</Link>
        </div>

        {/* Box 3: Create True/False and Multiple Choice Quiz */}
        <div className="grid-box">
          <h2>Create Quizzes</h2>
          <Link to="/create-true-false">Create True/False Quiz</Link>
          <Link to="/create-multi-choice">Create Multiple Choice Quiz</Link>
          <Link to="/show-quizzes">Show All Quizzes</Link>
        </div>

        <div className="grid-box">
          <h2>Take Quizzes</h2>
          <Link to="/take-quiz">Take a Quiz</Link>
          <Link to="/show-scores">Show Previous Scores</Link>
        </div>
      </div>
    </div>
  );
};


    

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-collection" element={<CreateQuizCollection />} />
        <Route path="/show-collections" element={<ShowCollections />} />
        <Route path="/create-multi-choice" element={<CreateMFQuiz />} />
        <Route path="/create-true-false" element={<CreateTFQuiz />} />
        <Route path="/show-quizzes" element={<ShowQuizzes />} />
        <Route path="/take-quiz" element={<ShowAns />} />
        <Route path="/show-scores" element={<ShowScores />} />
      </Routes>
    </Router>
  );
};

export default App;