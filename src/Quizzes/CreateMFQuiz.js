import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../APICalls/Api";
import "../QuizCollections/Create.css";

const CreateMultipleChoiceQuiz = () => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      option1,
      option2,
      option3,
      option4,
      answer: parseInt(answer), // Ensure it's an integer
    };

    try {
      const response = await apiRequest("/multiple-choice-questions/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Multiple Choice Quiz Created Successfully!");
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
      <h2 className="app-title">Create Multiple Choice Quiz</h2>
      <form className="quiz-collection-form" onSubmit={handleSubmit}>
        
        <input
          type="text"
          className="input-field"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <input
          type="text"
          className="input-field"
          placeholder="Option 1"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
          required
        />

        <input
          type="text"
          className="input-field"
          placeholder="Option 2"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
          required
        />

        <input
          type="text"
          className="input-field"
          placeholder="Option 3"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
          required
        />

        <input
          type="text"
          className="input-field"
          placeholder="Option 4"
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
          required
        />

        <select
          className="styled-select"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required
        >
          <option value="">Select Correct Answer</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
        </select>

        <button type="submit" className="submit-btn">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateMultipleChoiceQuiz;
