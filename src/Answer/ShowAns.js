import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../APICalls/Api";

const ShowAns = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const response = await apiRequest("/quiz-collections/?filter=shared");
                const data = await response.json();

                console.log("API Response:", data); // Debugging log

                if (Array.isArray(data)) {
                    setCollections(data);
                } else if (data.results) {
                    setCollections(data.results);
                } else {
                    throw new Error("Unexpected API response format");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCollections();
    }, []);

    const handleAnswerChange = (quizId, questionType, selectedAnswer) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [`${questionType}_${quizId}`]: selectedAnswer, // Ensuring correct format QuizType_QuizID
        }));
    };

    const handleSubmit = async (collectionID) => {
        // Extract Multi-Choice and True/False Quiz IDs
        const multiQuizID = [];
        const trueFalseQuizID = [];
        const answers = {};
    
        Object.entries(userAnswers).forEach(([key, value]) => {
            const [quizType, quizId] = key.split("_");
    
            if (quizType === "multipleChoice") {
                multiQuizID.push(parseInt(quizId));
                answers[`MC_${quizId}`] = value;
            } else if (quizType === "trueFalse") {
                trueFalseQuizID.push(parseInt(quizId));
                answers[`TF_${quizId}`] = value === "1";
            }
        });
    
        const payload = {
            collectionID,
            multiQuizID,
            trueFalseQuizID,
            answers,
            score: 1, // Placeholder, can be computed after API validation
        };
    
        console.log("Submitting Payload:", payload);
    
        try {
            const response = await apiRequest("/quiz-collection-answers/", {
                method: "POST",
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                throw new Error("Failed to submit quiz");
            }
    
            console.log("Quiz submitted successfully");
        } catch (err) {
            console.error("Error submitting quiz:", err.message);
        }
        navigate("/");
    };

    if (loading) return <p className="loading-text">Loading collections...</p>;
    if (error) return <p className="error-text">Error: {error}</p>;

    return (
        <div className="grid-container">
            {collections.length === 0 ? (
                <p className="no-collections">No collections found.</p>
            ) : (
                collections.map((collection) => (
                    <div key={collection.id} className="grid-box">
                        <h2>{collection.title}</h2>

                        {/* True/False Questions */}
                        <div className="question-section">
                            <strong>True/False Questions:</strong>
                            <ul className="question-list">
                                {collection.true_false_questions?.length > 0 ? (
                                    collection.true_false_questions.map((question) => (
                                        <li key={question.id}>
                                            {question.question}
                                            <div className="answer-options">
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`trueFalse_${question.id}`}
                                                        value="1"
                                                        checked={userAnswers[`trueFalse_${question.id}`] === "1"}
                                                        onChange={() => handleAnswerChange(question.id, "trueFalse", "1")}
                                                    /> 
                                                    True
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name={`trueFalse_${question.id}`}
                                                        value="0"
                                                        checked={userAnswers[`trueFalse_${question.id}`] === "0"}
                                                        onChange={() => handleAnswerChange(question.id, "trueFalse", "0")}
                                                    /> 
                                                    False
                                                </label>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No true/false questions.</li>
                                )}
                            </ul>
                        </div>

                        {/* Multiple Choice Questions */}
                        <div className="question-section">
                            <strong>Multiple Choice Questions:</strong>
                            <ul className="question-list">
                                {collection.multiple_choice_questions?.length > 0 ? (
                                    collection.multiple_choice_questions.map((question) => (
                                        <li key={question.id}>
                                            {question.question}
                                            <div className="answer-options">
                                                {[1, 2, 3, 4].map((num) => {
                                                    return (
                                                        <label key={num}>
                                                            <input
                                                                type="radio"
                                                                name={`multipleChoice_${question.id}`}
                                                                value={num}
                                                                checked={userAnswers[`multipleChoice_${question.id}`] === `${num}`}
                                                                onChange={() => handleAnswerChange(question.id, "multipleChoice", `${num}`)}
                                                            /> 
                                                            {question[`option ${num}`]}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li>No multiple-choice questions.</li>
                                )}
                            </ul>
                        </div>  

                        {/* Submit Button */}
                        <button onClick={() => handleSubmit(collection.id)}>Submit Answers</button>              
                    </div>
                ))
            )}
        </div>
    );
};

export default ShowAns;
