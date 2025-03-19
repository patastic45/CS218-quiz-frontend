import React, { useEffect, useState } from "react";
import { apiRequest } from "../APICalls/Api";

const ShowScores = () => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect(() => {
        const loadScores = async () => {
            try {
                const response = await apiRequest("/quiz-collection-answers/");
                const data = await response.json();

                console.log("API Response:", data);

                if (Array.isArray(data)) {
                    setScores(data);
                } else if (data.results) {
                    setScores(data.results);
                } else {
                    throw new Error("Unexpected API response format");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadScores();
    }, []);

    if (loading) return <p className="loading-text">Loading scores...</p>;
    if (error) return <p className="error-text">Error: {error}</p>;

    return (
        <div className="grid-container">
            {scores.length === 0 ? (
                <p className="no-scores">No scores found.</p>
            ) : (
                scores.map((score) => (
                    <div key={score.id} className="grid-box">
                        <h2>Quiz: {score.collectionID.title}</h2>
                        <p><strong>Score:</strong> {score.score}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ShowScores;
