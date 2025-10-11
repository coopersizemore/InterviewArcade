import './FeedbackPage.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedbackColumn from './FeedbackColumn';
import AudioPlayer from './AudioPlayer';

function FeedbackPage() {
    const location = useLocation();

    // 1. Access the data from the location's state
    // Use optional chaining (?.) in case the page is loaded directly
    // const feedbackData = location.state?.feedback;
    const feedbackData = {
        "code_review": {
            "score": "8/10",
            "strengths_list": [
            "Good variable naming",
            "Effective use of modern JavaScript (async/await)",
            "Clean code structure"
            ],
            "strengths_description": "The code is well-organized and easy to follow. Variable names are descriptive, which greatly improves readability. The use of async/await for handling asynchronous operations is a great example of modern, clean JavaScript.",
            "improvements_list": [
            "Error handling could be more robust",
            "Lack of comments for complex logic",
            "Opportunity to componentize UI elements"
            ],
            "improvements_description": "While the code works for the happy path, adding more comprehensive error handling with try-catch blocks would make it more resilient. Some of the more complex functions could benefit from comments explaining the 'why' behind the logic. Consider breaking down larger UI sections into smaller, reusable components."
        },
        "audio_review": {
            "score": "7/10",
            "strengths_list": [
            "Clear and steady speaking pace",
            "Confident tone",
            "Good articulation"
            ],
            "strengths_description": "Your speaking voice is clear and easy to understand. You maintain a consistent pace and a confident tone, which helps in conveying your points effectively. Your articulation is excellent.",
            "improvements_list": [
            "Frequent use of filler words ('um', 'like')",
            "Could elaborate more on the thought process",
            "Slightly monotonous pitch"
            ],
            "improvements_description": "Try to be mindful of filler words like 'um' and 'like', as they can sometimes be distracting. When solving the problem, it would be beneficial to explain your thought process in more detail. Varying your vocal pitch could also make your explanation more engaging for the listener."
        },
        "transcript": "Okay, so for this problem, I think the first step is to, um, get the data from the API. I'll use the fetch function for that since it's built-in. So I'll write an async function... yeah, that seems right. I'll need to, like, handle the response and parse it as JSON. After I have the data, I can map over the array to create the list items. For each item in the data array, I will return a div with the user's name. This should render the list on the screen."
    }

    // function cardClick() {
    //     console.log("Hello World!")
    // }

    // State to manage the audio loading process
    const [isAudioLoading, setIsAudioLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState(null);

    useEffect(() => {
        // Simulate fetching the audio file after the component mounts
        const fetchAudio = () => {
            console.log("Fetching AI voiceover...");
            setTimeout(() => {
                // Once the "request" is done, set the URL and stop loading
                // Replace with a real audio file URL when you have one
                const temporaryAudioFile = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
                setAudioUrl(temporaryAudioFile);
                setIsAudioLoading(false);
                console.log("Audio loaded!");
            }, 3000); // Simulate a 3-second delay
        };

        // const fetchAudio = async () => {
        //     console.log("Fetching AI voiceover...");
        //     setIsAudioLoading(true); // Ensure loading is true at the start

        //     try {
        //         // The actual GET request to your backend endpoint
        //         const response = await fetch('/feedback/transcript');

        //         // It's crucial to check if the request was successful
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! Status: ${response.status}`);
        //         }

        //         const data = await response.json(); // { "audio_filepath": "/path/to/audio.mp3" }

        //         // --- This is the important part ---
        //         // Prepend your backend's URL to the relative path
        //         // In development, this might be 'http://localhost:5000'
        //         // In production, it would be 'https://yourapi.com'
        //         const backendUrl = process.env.REACT_APP_BACKEND_URL || ''; 
        //         const fullAudioUrl = `${backendUrl}${data.audio_filepath}`;
                
        //         console.log("Audio loaded from:", fullAudioUrl);
        //         setAudioUrl(fullAudioUrl);

        //     } catch (error) {
        //         console.error("Failed to fetch audio:", error);
        //         // You could set an error state here to show a message to the user
        //     } finally {
        //         // This block runs whether the fetch succeeded or failed
        //         setIsAudioLoading(false);
        //     }
        // };

        fetchAudio();
    }, []); // Empty array ensures this runs only once

    if (!feedbackData) {
        return <div>No feedback data available. Please complete an interview first.</div>;
    }

    return (
        <div className="split-container">
            <div className="left-pane">
                {/* Use the reusable component for both reviews */}
                <FeedbackColumn title="Code Review" reviewData={feedbackData.code_review} />
                <FeedbackColumn title="Audio Review" reviewData={feedbackData.audio_review} />
            </div>
            <div className="right-pane">
                <div className="recording">
                    <h3>AI Voiceover</h3>
                    <AudioPlayer src={audioUrl} isLoading={isAudioLoading} />
                </div>
                <div className="transcript">
                    <h3>Transcript</h3>
                    <p>{feedbackData.transcript}</p>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;
