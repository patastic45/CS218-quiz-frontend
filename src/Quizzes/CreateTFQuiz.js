import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../APICalls/Api";
import "../QuizCollections/Create.css";

const CreateTrueFalseQuiz = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      answer: parseInt(answer) === 1, // Ensure it's an integer
    };

    try {
      const response = await apiRequest("/true-false-questions/", {
        method: "POST", 
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("True or False Quiz Created Successfully!");
        navigate("/");
      } else {
        alert("Failed to create quiz.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating quiz.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="app-title">Create True or False Choice Quiz</h2>
      <form className="quiz-collection-form" onSubmit={handleSubmit}>
        
        <input
          type="text"
          className="input-field"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <select
          className="styled-select"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        >
          <option value="">Select Correct Answer</option>
          <option value="1">True</option>
          <option value="0">False</option>
        </select>

        <button type="submit" className="submit-btn">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateTrueFalseQuiz;
