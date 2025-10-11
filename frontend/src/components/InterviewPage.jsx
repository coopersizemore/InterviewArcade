import React from 'react'
import { useNavigate } from 'react-router-dom'
// import {CSidebar, CSidebarHeader, CSidebarBrand} from '@coreui/react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import Editor from '@monaco-editor/react';


const InterviewPage = () => {
    // things needed from previous screen - company name
    // components
    // left column with problem statement, description, expected outputs etc.
    // most of the screen will be an empty code editor to write code in
        // there should be a component for this
    // ai icon in the top corner which would maximize and minimize as if listening
    // for starters, does not need to actually detect voice, maybe it is a constant animation
    // audio streamer needs to be used 
    

    return (
        // <CSidebar className='border-end'>
        //     <CSidebarHeader className="border-bottom">
        //     <CSidebarBrand>Problem Description</CSidebarBrand>
        //     </CSidebarHeader>
        // </CSidebar>
        <div style={{height: '100vh'}}>
        <Sidebar style={{ width: '35vw', height: '100vh' }}>
            <Menu>
                <MenuItem> Problem Title </MenuItem>
                <MenuItem> Problem Description </MenuItem>
                {/* 2 columns - one with sample input, and another with sample output */}
                <MenuItem> Sample Input & Output 1</MenuItem>
                <MenuItem> Sample Output & Output 2</MenuItem>
            </Menu>
        </Sidebar>
        <Editor defaultLanguage='python' theme='light'></Editor>
        <button style={{width: '20vw', height: '10vh', position:"fixed", bottom: '20px', right: '20px', justifyContent: 'center'}}> End Interview! </button>
        </div>
    )

    
    
    
}



// Maybe reusable for FeedbackPage
// sample 2 column layout component
// for each column
// have title
// have content area

export default InterviewPage