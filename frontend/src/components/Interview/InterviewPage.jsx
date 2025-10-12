import React, {useCallback, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// import {CSidebar, CSidebarHeader, CSidebarBrand} from '@coreui/react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// import Editor from '@monaco-editor/react';
import CodeEditor from './CodeEditor.jsx'
import Alert from 'react-bootstrap/Alert';
import { BASE_URL } from '../../config.js';
import useAudioRecorder from "../../hooks/useAudioRecorder";
import './InterviewPage.css'


const InterviewPage = () => {
    const location = useLocation();
    const { question } = location.state || {};
    const [codeValue, setCodeValue] = useState('')
    const[recordingAlert, setRecordingAlert] = useState(false)
    const[error, setError] = useState('')
    const[data, setData] = useState('')


// ChatGPT 
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
  });
}

    const onChunk = useCallback(async (blob) => {
        
        const payload = {
            filename: 'audio_file',
            // ENCODE from binary to base64
            data: blob.toString('base64')
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
            setError(err.message)
        }

        setError("")
        console.log("New audio chunk:", blob);
      }, []);

    const {startAudio, stopAudio} = useAudioRecorder(onChunk);

    // const[problemInfo, setProblemInfo] = useState('')
    const endInterview = () => {
        // stop recording
        stopAudio()
        // do POST request with code solution
        console.log(codeValue)

        // while waiting for reponse, navigate to loading screen
        try {
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
            }
            )
        }
        // when done, pass in the response into feedback page

    }
    
    // things needed from previous screen - company name
    // components

    // left column with problem statement, description, expected outputs etc.
    // most of the screen will be an empty code editor to write code in
        // there should be a component for this
    // ai icon in the top corner which would maximize and minimize as if listening
    // for starters, does not need to actually detect voice, maybe it is a constant animation
    // audio streamer needs to be used 
    
    // const [startFirstRecording, setStartFirstRecording] = useState(true);

    useEffect(() => {
        // call get route for getting question via question ID here
        // const fetchProblemInfo = async () => {
        //     try{
        //         const response = await fetch(`${BASE_URL}/api/questions/id/${questionId}`)
        //         const result = await response.json()
        //         setData(result)
        //     } catch (err) {
        //         setError(err.message)                
        //     }
            
        //     setError('')
        // }

        // // GET INFO ON PROBLEM
        // fetchProblemInfo()
        // Notify user recording has started
        setRecordingAlert(true)
        // Start recording
        startAudio()

    }, []);

    return (
       
        <div style={{display: "flex", height: '100vh'}}>
            {/* The below alert does not work yet */}

        {recordingAlert && <Alert variant='info' dismissible onClose={setRecordingAlert(false)}> Audio recording has started! </Alert>}        
        {error && <Alert variant='danger'> Something went wrong! Please refresh! </Alert>}
        <Sidebar style={{ display: "inline-block", width: '35vw', height: '100vh' }}>
            <Menu>
                <MenuItem className='code'> {question?.title} </MenuItem>
                <MenuItem> {question?.description} </MenuItem>
                {/* 2 columns - one with sample input, and another with sample output */}
                {/* For each example, populate thingy */}
                <MenuItem className='code'> {question.}Sample Input & Output 1</MenuItem>
                {/* For each constraint, populate as bullet point */}
                <MenuItem> Sample Output & Output 2</MenuItem>
                {/* For each hint, populate as bullet point */}
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

export default InterviewPage
