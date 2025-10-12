import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GlowingCard from './GlowingCard';
import './StartPage.css'

function StartPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // isLoading now starts as 'false'. It will be true only AFTER the user clicks.
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // The fetch logic is now inside the click handler
    const cardClick = async () => {
        setIsLoading(true); // Show the loading screen
        setError(null); // Clear any previous errors

        // Read the instructions (company name or random flag) from the previous page
        const { company, random } = location.state || {};
        let apiUrl = '';

        // Build the correct API URL based on the instructions
        if (company) {
            apiUrl = `http://localhost:8000/api/questions/companyName/${company}`;
        } else if (random) {
            apiUrl = `http://localhost:8000/api/questions/random`;
        } else {
            // This is a fallback in case the page is reached without proper state
            setError('No interview type specified. Please go back and select an option.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Could not fetch interview question.');
            }

            const questionToPass = await response.json();
            if (questionToPass) {
                console.log("Navigating to interview with question:", questionToPass);
                // On success, navigate to the interview page with the question
                navigate('/interview', { state: { question: questionToPass } });
            } else {
                throw new Error('No questions found for the selected criteria.');
            }
        } catch (err) {
            // If anything fails, stop loading and show the error message
            setError(err.message);
            setIsLoading(false);
        }
    };

    // --- UI RENDERING ---

    if (isLoading) {
        // This screen is shown only after the card is clicked
        return <div>LOADING INTERVIEW...</div>;
    }

    if (error) {
        // Show a helpful error message and a way to go back
        return (
        <div>
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    return (
        <div className="start-page-container">
            <h2>Information</h2>
            <ul className="information-list">
                <li>1 Question</li>
                <li>5 Minutes</li>
                <li>Happy Practicing!</li>
            </ul>
            <GlowingCard onClick={cardClick}/>
        </div>
    )
}

export default StartPage;
