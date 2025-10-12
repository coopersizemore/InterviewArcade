import {useRef, useState} from 'react';
import Editor from '@monaco-editor/react';


const CodeEditor = ({ value, onChange }) => {
  const focusRef = useRef(null);

  const focusOnEditor = (editor) => {
    focusRef.current = editor;
    editor.focus();
  };

  return (
    <Editor
      height="100vh"
      language="python"
      value={value}
      onChange={onChange}
      theme="light"
      onMount={focusOnEditor}
    />
  );
};

export default CodeEditor
