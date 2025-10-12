import React, {useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar, Menu } from 'react-pro-sidebar';
import CodeEditor from './CodeEditor.jsx'
import { BASE_URL } from '../../config.js';
import BreakoutLoadingScreen from "../Loading/BreakoutLoadingScreen";
import useAudioRecorder from "../../hooks/useAudioRecorder";
import './InterviewPage.css'


function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            // reader.result is a string like "data:audio/mpeg;base64,UklGRi..."
            // We split the string at the comma and take the second part.
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
    });
}

const InterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { question } = location.state || {};
    const [codeValue, setCodeValue] = useState('')    
    const[error, setError] = useState('')    
    const[isLoading, setIsLoading] = useState(false)
    const [showHints, setShowHints] = useState(false);

    const INTERVIEW_DURATION = 300;  // The duration of the interview in seconds

    // More state for the timer
    const [timeRemaining, setTimeRemaining] = useState(INTERVIEW_DURATION);  // Set to 300 seconds, or 5 minutes
    
    // Defining dynamic timer hue
    const hue = (timeRemaining / INTERVIEW_DURATION) * 120
    const timerColor = `hsl(${hue}, 90%, 45%)`

    const onChunk = useCallback(async (blob) => {
        console.log("CHUNKIN")
        
        const payload = {
            // ENCODE from binary to base64
            data: await blobToBase64(blob),
            data_type: "audio/wav"
        }
        try{
            const response = await fetch(`http://localhost:8000/api/audio`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)                
            }
            )
        } catch (err){
            console.log("Bad things have happened")
            setError(err.message)
        }

        setError("")
        console.log("New audio chunk:", blob);
      }, []);

    const { startAudio, stopAudio } = useAudioRecorder(onChunk);

    const endInterview = async () => {
        // stop recording
        stopAudio()
        setTimeout(() => {}, 5000);
        // do POST request with code solution
        console.log(codeValue)

        // while waiting for reponse, navigate to loading screen
        try {
            // navigate("/loading", { state: { data: codeValue } })

            setIsLoading(true)

            // This needs to happen in loading screen
            console.log(codeValue)
            const response = await fetch (`http://localhost:8000/api/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        question: question.description,
                        code: codeValue                        
                    }
                )
            })

            const result = await response.json()
            setIsLoading(false)
            setError("")
            navigate('/feedback', { state: { data: result } })
            
        } catch (err){  
            setError(err.message)
        }
        // when done, pass in the response into feedback page

    }    
    
    // Manages the stopwatch
    useEffect(() => {
        if (timeRemaining <= 0) {
            endInterview();
            return;
        }

        const timerId = setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeRemaining, endInterview]);

    // Handles stopping and starting the audio recording
    useEffect(() => {
        const initializeRecording = async () => {
            try {
                await startAudio();            
            } catch (error) {
                // Handle the case where the user denies microphone permission
                setError("Microphone access was denied. Please refresh and grant permission.");
            }
        };

        initializeRecording();

        // The cleanup function is crucial for stopping the mic when the user navigates away
        return () => {
            stopAudio();
        };
    }, [startAudio, stopAudio]); // The dependency array is now correct and stable

    // Helper function for time conversion
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    if (isLoading) {
        return (
            <BreakoutLoadingScreen></BreakoutLoadingScreen>
        )
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <div className="app-bar">
                <div className="app-bar-title">Interview Arcade</div>
                <div className="stopwatch" style={{backgroundColor: timerColor}}>
                    {formatTime(timeRemaining)} / 5:00
                </div>
            </div>
       
        <div style={{display: "flex", height: '100vh'}}>
            {/* The below alert does not work yet */}
  
            <Sidebar style={{ display: "inline-block", width: '35vw', height: '100vh' }}>
                <Menu style={{ padding: "0 30px" }}>                
                    <div className='problem-title' style={{ "fontSize": '40px', "fontWeight": 'bold', }}>
                        {question?.title}
                    </div>
                    <div className="problem-description">
                        {question?.description}
                    </div>
                    {/* 2 columns - one with sample input, and another with sample output */}
                    {/* For each example, populate thingy */}

                    {
                        question?.examples?.length > 0 && (
                            <h2 style={{ "textAlign": 'left'}}>Examples</h2>
                        )
                    }
                    {question?.examples?.map((example, index) => (
                        <div key={index}>
                            <div className="row">
                                <div className="input">Input: {example.input}</div>
                                <div className="output">Output: {example.output}</div>
                            </div>
                            <div className="explanation">Explanation: {example.explanation}</div>
                        </div>
                    ))
                    }

                    {
                        question?.constraints?.length > 0 && (
                            <h2 style={{ "textAlign": 'left'}} >Constraints</h2>
                        )
                    }

                    {question?.constraints?.map((constraint, index) => (
                        <div key={index}>
                            {constraint}
                        </div>
                    ))
                    }

                    {
                        question?.hints?.length > 0 && (
                            <div>
                                <button
                                    style={{
                                        marginTop: '24px',
                                        marginBottom: '0px',
                                        background: '#ffffffff',
                                        border: 'none',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={() => setShowHints(h => !h)}
                                >
                                    {showHints ? 'Hide Hints' : 'Show Hints'}
                                </button>
                                {showHints && (
                                    <div>
                                        <h2 style={{ "textAlign": 'left'}} >Hints</h2>
                                        {question.hints.map((hint, index) => (
                                            <div key={index}>
                                                {hint}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    }                            
                </Menu>
            </Sidebar>
            <div style={{display: "inline-block", width: '65vw', height: '100vh'}}>
                <CodeEditor style={{display: "inline", width: '65vw', height: '100vh'}}            
                value={question.starterCode.python} 
                onChange={(newCode) => setCodeValue(newCode)}
                >
                </CodeEditor>
            </div>
            <button 
                style={{width: '20vw', height: '10vh', position:"fixed", bottom: '20px', right: '20px', justifyContent: 'center', zIndex: 10}}
                onClick={endInterview}> 
                End Interview! 
            </button>
            </div>
        </div>
    )    
    
    
}

export default InterviewPage;
