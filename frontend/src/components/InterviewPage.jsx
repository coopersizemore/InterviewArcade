import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import {CSidebar, CSidebarHeader, CSidebarBrand} from '@coreui/react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Editor from '@monaco-editor/react';
import CodeEditor from './CodeEditor.jsx'
import Alert from 'react-bootstrap/Alert';



const InterviewPage = () => {
    const [codeValue, setCodeValue] = useState('')
    const[recordingAlert, setRecordingAlert] = useState(false)

    const endInterview = () => {
        // stop recording
        // do POST request with code solution
        // while waiting for reponse, navigate to loading screen
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
    
    // TODO: add useEffect for starting recording the first time screen is loaded
    const [startFirstRecording, setStartFirstRecording] = useState(true);

    useEffect(() => {
        // call get route for getting question via question ID here
        if (true){
            // Make user aware that recording has started (alert?) - dismissable (for now)
            // Would like to fade alert on its own, but too much work for now
            setRecordingAlert(true)
            // START AUDIO RECORDING - and perform post request every 60 seconds of recording

            // need to handle stopping audio recording outside of this somehow, with
            // the End Interview OnClick event
            console.log("This function is being called!")
        }

    }, []);

    return (
        // <CSidebar className='border-end'>
        //     <CSidebarHeader className="border-bottom">
        //     <CSidebarBrand>Problem Description</CSidebarBrand>
        //     </CSidebarHeader>
        // </CSidebar>
        <div style={{display: "flex", height: '100vh'}} >
            {/* The below alert does not work yet */}
        {/* {recordingAlert && <Alert variant='info' dismissible onClose={setRecordingAlert(false)}> Audio recording has started! </Alert>} */}
        <Sidebar style={{ width: '35vw', height: '100vh' }}>
            <Menu>
                <MenuItem> Problem Title </MenuItem>
                <MenuItem> Problem Description </MenuItem>
                {/* 2 columns - one with sample input, and another with sample output */}
                <MenuItem> Sample Input & Output 1</MenuItem>
                <MenuItem> Sample Output & Output 2</MenuItem>
            </Menu>
        </Sidebar>
        <CodeEditor 
            value={codeValue} 
            onChange={
                (codeValue) => setValue(codeValue)
            }
        ></CodeEditor>
        <button 
            style={{width: '20vw', height: '10vh', position:"fixed", bottom: '20px', right: '20px', justifyContent: 'center'}}
            onClick={endInterview}> 
            End Interview! 
        </button>
        </div>
    )    
    
    
}



// Maybe reusable for FeedbackPage
// sample 2 column layout component
// for each column
// have title
// have content area

export default InterviewPage