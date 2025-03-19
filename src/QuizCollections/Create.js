import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../APICalls/Api";
import "./Create.css";

const CreateQuizCollection = () => {
  const [title, setTitle] = useState("");
  const [trueFalseQuestions, setTrueFalseQuestions] = useState([]);
  const [multiQuestions, setMultiQuestions] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [availableTrueFalse, setAvailableTrueFalse] = useState([]);
  const [availableMulti, setAvailableMulti] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);

  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trueFalseResponse = await apiRequest("/true-false-questions");
        if (trueFalseResponse.ok) {
          const data = await trueFalseResponse.json();
          setAvailableTrueFalse(Array.isArray(data) ? data : []);
        }

        const multiResponse = await apiRequest("/multiple-choice-questions");
        if (multiResponse.ok) {
          const data = await multiResponse.json();
          console.log(data);
          setAvailableMulti(Array.isArray(data) ? data : []);
        }

        const usersResponse = await apiRequest("/user");
        if (usersResponse.ok) {
          const data = await usersResponse.json();
          setAvailableUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      true_false_question_ids: trueFalseQuestions.map(Number),
      multiple_choice_question_ids: multiQuestions.map(Number),
      shared_with: sharedWith.map(Number),
    };

    try {
      const response = await apiRequest("/quiz-collections/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Quiz Collection Created Successfully!");
        navigate("/");
      } else {
        alert("Failed to create quiz collection.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating quiz collection.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="app-title">Create Quiz Collection</h2>
      <form className="quiz-collection-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="input-field"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="form-grid">
        <div className="form-group">
          <label>True/False Questions:</label>
          <select
            multiple
            className="styled-select"
            onChange={(e) =>
              setTrueFalseQuestions([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {availableTrueFalse.map((q) => (
              <option key={q.id} value={q.id}>
                {q.question}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Multiple Choice Questions:</label>
          <select
            multiple
            className="styled-select"
            onChange={(e) =>
              setMultiQuestions([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {availableMulti.map((q) => (
              <option key={q.id} value={q.id}>
                {q.question}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Share With:</label>
          <select
            multiple
            className="styled-select"
            
            onChange={(e) =>
              setSharedWith([...e.target.selectedOptions].map((o) => o.value))
            }
          >
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="submit-btn">Create Collection</button>
    </form>

    </div>
  );
};

export default CreateQuizCollection;
