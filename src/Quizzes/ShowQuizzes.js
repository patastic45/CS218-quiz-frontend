import React, { useEffect, useState } from "react";
import { apiRequest } from "../APICalls/Api";
import styles from "./Quizzes.module.css";


const ShowQuizzes = () => {
    const [trueFalseQuizzes, setTrueFalseQuizzes] = useState([]);
    const [multiChoiceQuizzes, setMultiChoiceQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadQuizzes = async () => {
            try {
                const trueFalseResponse = await apiRequest("/true-false-questions");
                const multiChoiceResponse = await apiRequest("/multiple-choice-questions");
                
                const trueFalseData = await trueFalseResponse.json();
                const multiChoiceData = await multiChoiceResponse.json();

                console.log("True/False Quizzes:", trueFalseData);
                console.log("Multiple Choice Quizzes:", multiChoiceData);
                
                setTrueFalseQuizzes(Array.isArray(trueFalseData) ? trueFalseData : trueFalseData.results || []);
                setMultiChoiceQuizzes(Array.isArray(multiChoiceData) ? multiChoiceData : multiChoiceData.results || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadQuizzes();
    }, []);

    if (loading) return <p className={styles.loadingText}>Loading quizzes...</p>;
    if (error) return <p className={styles.errorText}>Error: {error}</p>;

    return (
        <div className={styles.quizContainer}>
            {/* True/False Quizzes */}
            <div className={styles.quizSection}>
                <h2 className={styles.heading}>True/False Quizzes</h2>
                <div className={styles.quizGrid}>
                    {trueFalseQuizzes.map((question) => (
                        <div key={question.id} className={styles.quizCard}>
                            <strong>Q:</strong> {question.question}
                        </div>
                    ))}
                </div>
            </div>

            {/* Multiple Choice Quizzes */}
            <div className={styles.quizSection}>
                <h2 className={styles.heading}>Multiple Choice Quizzes</h2>
                <div className={styles.quizGrid}>
                    {multiChoiceQuizzes.map((question) => (
                        <div key={question.id} className={styles.quizCard}>
                            <strong>Q:</strong> {question.question}
                            <ul>
                                <li>A: {question.option1}</li>
                                <li>B: {question.option2}</li>
                                <li>C: {question.option3}</li>
                                <li>D: {question.option4}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default ShowQuizzes;