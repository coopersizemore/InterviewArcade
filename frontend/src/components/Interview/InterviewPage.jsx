import React, {useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import CodeEditor from './CodeEditor.jsx'
import Alert from 'react-bootstrap/Alert';
import { BASE_URL } from '../../config.js';
import useAudioRecorder from "../../hooks/useAudioRecorder";
import './InterviewPage.css'


// ChatGPT 
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

const InterviewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { question } = location.state || {};
    const [codeValue, setCodeValue] = useState('')
    const[recordingAlert, setRecordingAlert] = useState(false)
    const[error, setError] = useState('')
    const[data, setData] = useState('')
    const[isLoading, setIsLoading] = useState(false)

    const onChunk = useCallback(async (blob) => {
        console.log("CHUNKIN")
        
        const payload = {
            filename: 'audio_file',

            // ENCODE from binary to base64
            data: await blobToBase64(blob),
        }
        try{
            const response = await fetch(`${BASE_URL}/api/audio`,{
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
        // do POST request with code solution
        console.log(codeValue)

        // while waiting for reponse, navigate to loading screen
        try {
            // navigate("/loading", { state: { data: codeValue } })

            setIsLoading(true)

            // This needs to happen in loading screen
            const response = await fetch (`${BASE_URL}/api/feedback`, {
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


    useEffect(() => {
    const initializeRecording = async () => {
        try {
            await startAudio();
            setRecordingAlert(true);
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

    return (
       
        <div style={{display: "flex", height: '100vh'}}>
            {/* The below alert does not work yet */}

        {recordingAlert && <Alert variant='info' dismissible onClose={() => setRecordingAlert(false)}> Audio recording has started! </Alert>}        
        {error && <Alert variant='danger'> Something went wrong! Please refresh! </Alert>}
        <Sidebar style={{ display: "inline-block", width: '35vw', height: '100vh' }}>
            <Menu>
                <MenuItem className='code'> {question?.title} </MenuItem>
                <MenuItem> {question?.description} </MenuItem>
                {/* 2 columns - one with sample input, and another with sample output */}
                {/* For each example, populate thingy */}

                {
                    question?.examples?.length > 0 && (
                        <h2>Examples</h2>
                    )
                }
                {question?.examples?.map((example, index) => (
                    <div key={index}>
                        <div className="row">
                            <div className="input">{example.input}</div>
                            <div className="output">{example.output}</div>
                        </div>
                        <div className="explanation">{example.explanation}</div>
                    </div>
                ))
                }

                {
                    question?.constraints?.length > 0 && (
                        <h2>Constraints</h2>
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
                        <h2>Hints</h2>
                    )
                }

                {question?.hints?.map((hint, index) => (
                    <div key={index}>
                        {hint}
                    </div>
                ))
                }                            
            </Menu>
        </Sidebar>
        <div style={{display: "inline-block", width: '65vw', height: '100vh'}}>
            <CodeEditor style={{display: "inline", width: '65vw', height: '100vh'}}            
            value={question.starterCode.python} 
            onClick={() => setCodeValue(codeValue)}
            >
            </CodeEditor>
        </div>
        <button 
            style={{width: '20vw', height: '10vh', position:"fixed", bottom: '20px', right: '20px', justifyContent: 'center', zIndex: 10}}
            onClick={endInterview}> 
            End Interview! 
        </button>
        </div>
    )    
    
    
}

export default InterviewPage;
