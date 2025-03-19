import React, { useEffect, useState } from "react";
import { apiRequest } from "../APICalls/Api";

const AllCollections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCollections = async () => {
            try {
                const response = await apiRequest("/quiz-collections/?filter=owned");
                const data = await response.json(); // Parse JSON
                console.log("API Response:", data);  // DEBUGGING LINE

                if (Array.isArray(data)) {
                    setCollections(data); // Ensure it's an array
                } else if (data.results) {
                    setCollections(data.results); // Handle paginated responses
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

                        <div className="question-section">
                            <strong>True/False Quiz Titles:</strong>
                            <ul className="question-list">
                                {(collection.true_false_questions || []).length > 0 ? (
                                    collection.true_false_questions.map((question) => (
                                        <li key={question.id}>{question.question}</li>
                                    ))
                                ) : (
                                    <li>No true/false questions.</li>
                                )}
                            </ul>
                        </div>

                        <div className="question-section">
                            <strong>Multiple Choice Quiz Titles:</strong>
                            <ul className="question-list">
                                {(collection.multiple_choice_questions || []).length > 0 ? (
                                    collection.multiple_choice_questions.map((question) => (
                                        <li key={question.id}>{question.question}</li>
                                    ))
                                ) : (
                                    <li>No multiple-choice questions.</li>
                                )}
                            </ul>
                        </div>

                        <div className="shared-section">
                            <strong>Shared With:</strong>
                            <ul className="shared-list">
                                {(collection.shared_with || []).length > 0 ? (
                                    collection.shared_with.map((user, index) => (
                                        <li key={index}>User ID: {user}</li>
                                    ))
                                ) : (
                                    <li>Not shared with anyone.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllCollections;
