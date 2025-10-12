import './FeedbackPage.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FeedbackColumn from './FeedbackColumn';
import AudioPlayer from './AudioPlayer';
import { jsPDF } from "jspdf";

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

    // 🧾 PDF Download Handler
    const handleDownloadPDF = () => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const lineHeight = 20;
        let y = 40;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Interview Feedback Summary", 40, y);
        y += 40;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);

        // --- Code Review ---
        doc.text("Code Review:", 40, y);
        y += 20;
        const codeReviewLines = doc.splitTextToSize(feedbackData.code_review || "No code review available.", 520);
        doc.text(codeReviewLines, 40, y);
        y += codeReviewLines.length * lineHeight + 10;

        // --- Audio Review ---
        doc.text("Audio Review:", 40, y);
        y += 20;
        const audioReviewLines = doc.splitTextToSize(feedbackData.audio_review || "No audio review available.", 520);
        doc.text(audioReviewLines, 40, y);
        y += audioReviewLines.length * lineHeight + 10;

        // --- Overall Assessment ---
        doc.text("Overall Assessment:", 40, y);
        y += 20;
        const assessmentLines = doc.splitTextToSize(feedbackData.overall_assessment || "No overall assessment available.", 520);
        doc.text(assessmentLines, 40, y);

        doc.save("mockly-feedback.pdf");
    };

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
                <button
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#007bff",
                        color: "white",
                        cursor: "pointer"
                    }}
                    onClick={handleDownloadPDF}
                >
                    📄 Download PDF
                </button>
            </div>
        </div>
    );
}

export default FeedbackPage;
