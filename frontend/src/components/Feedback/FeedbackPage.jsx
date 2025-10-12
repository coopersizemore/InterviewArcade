import './FeedbackPage.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedbackColumn from './FeedbackColumn';
import AudioPlayer from './AudioPlayer';

function FeedbackPage() {
    const location = useLocation();

    // 1. Access the data from the location's state
    // Use optional chaining (?.) in case the page is loaded directly
    const feedbackData = location.state?.data;
    // const feedbackData = {
    //     "code_review": {
    //         "score": "8/10",
    //         "strengths_list": [
    //         "Good variable naming",
    //         "Effective use of modern JavaScript (async/await)",
    //         "Clean code structure"
    //         ],
    //         "strengths_description": "The code is well-organized and easy to follow. Variable names are descriptive, which greatly improves readability. The use of async/await for handling asynchronous operations is a great example of modern, clean JavaScript.",
    //         "improvements_list": [
    //         "Error handling could be more robust",
    //         "Lack of comments for complex logic",
    //         "Opportunity to componentize UI elements"
    //         ],
    //         "improvements_description": "While the code works for the happy path, adding more comprehensive error handling with try-catch blocks would make it more resilient. Some of the more complex functions could benefit from comments explaining the 'why' behind the logic. Consider breaking down larger UI sections into smaller, reusable components."
    //     },
    //     "audio_review": {
    //         "score": "7/10",
    //         "strengths_list": [
    //         "Clear and steady speaking pace",
    //         "Confident tone",
    //         "Good articulation"
    //         ],
    //         "strengths_description": "Your speaking voice is clear and easy to understand. You maintain a consistent pace and a confident tone, which helps in conveying your points effectively. Your articulation is excellent.",
    //         "improvements_list": [
    //         "Frequent use of filler words ('um', 'like')",
    //         "Could elaborate more on the thought process",
    //         "Slightly monotonous pitch"
    //         ],
    //         "improvements_description": "Try to be mindful of filler words like 'um' and 'like', as they can sometimes be distracting. When solving the problem, it would be beneficial to explain your thought process in more detail. Varying your vocal pitch could also make your explanation more engaging for the listener."
    //     },
    //     "transcript": "Test"
    //     //"transcript": "Okay, so for this problem, I think the first step is to, um, get the data from the API"
    // }

    // function cardClick() {
    //     console.log("Hello World!")
    // }

    // State to manage the audio loading process
    const [isAudioLoading, setIsAudioLoading] = useState(true);
    const [audioData, setAudioData] = useState(null);

    useEffect(() => {
        // Fetches the text-to-speech data from the elevenlabs endpoint
        const fetchAudio = async () => {
            if (!feedbackData?.transcript) {
                console.log("Transcript Empty");
                return;
            }

            console.log("Hitting the eleven labs endpoint to get text-to-speech");
            setAudioData(null);
            setIsAudioLoading(true);

            try {
                const response = await fetch('http://localhost:8000/api/feedback/tts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transcript: feedbackData.transcript
                    })
                });

                console.log(`Response Status: ${response.status}`);
                if (!response.ok) {
                    throw new Error(`HTTP error: Status ${response.status}`);
                }
                
                let data = await response.blob();
                setAudioData(data);

            } catch (error) {
                console.log("Error with text-to-speech");
            } finally {
                setIsAudioLoading(false);
            }
        }

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
                    <AudioPlayer audioData={audioData} isLoading={isAudioLoading} />
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
