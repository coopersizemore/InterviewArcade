import {useRef, useState} from 'react';
import Editor from '@monaco-editor/react';


const CodeEditor = () => {
    // TODO - persist the state of code written
    const focusRef = useRef(null)
    const focusOnEditor = (editor) => {
        focusRef.current = editor;
        editor.focus();
    }
    return (
        <Editor 
            defaultLanguage='python' 
            defaultValue='# Write python code here!'
            theme='light' 
            onMount={
                focusOnEditor
            }
            >
            
        </Editor>
    )
}

export default CodeEditor
