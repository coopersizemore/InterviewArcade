import './FeedbackPage.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedbackColumn from './FeedbackColumn';
import AudioPlayer from './AudioPlayer';

function FeedbackPage() {
    const location = useLocation();

    const feedbackData = location.state?.data;

    // State to manage the audio loading process
    const [isAudioLoading, setIsAudioLoading] = useState(true);
    const [audioData, setAudioData] = useState(null);

    useEffect(() => {
        // Fetches the text-to-speech data from the elevenlabs endpoint
        const fetchAudio = async () => {
            console.log(feedbackData)
            if (!feedbackData?.overall_assessment) {
                console.log("Transcript Empty");
                return;
            }

            console.log("Hitting the eleven labs endpoint to get text-to-speech");
            setAudioData(null);
            setIsAudioLoading(true);

            try {
                // Comment out this code if you want to save elevenlabs credits
                const response = await fetch('http://localhost:8000/api/feedback/tts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        transcript: feedbackData.overall_assessment
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
                    <p>{feedbackData.overall_assessment}</p>
                </div>
            </div>
        </div>
    );
}

export default FeedbackPage;
