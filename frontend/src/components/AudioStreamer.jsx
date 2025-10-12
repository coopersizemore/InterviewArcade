import React, {useCallback, useState} from "react";
import useAudioRecorder from "../hooks/useAudioRecorder";

// I think this function is returning a component with two buttons, 
// however the user should not need to see both buttons
// what should happen is that audio recording begins when screen is loaded
// and the interview has started
// and the recording should be stopped only when the interview is ended

// so what we need is functionality is maybe a timer on the interview page before starting,
// and then audio recording is started, and sent over in 1 minute chunks
// (which may involve stopping the audio recording and then starting (iteratively)) to the backend
// until audio recording is finally stopped when user clicks on "End Interview"


export default function AudioStreamer() {
  const onChunk = useCallback(async (blob) => {
    // As per existing code, this may need to be a POST request to the backend...
    console.log("New audio chunk:", blob);
  }, []);

  const {start, stop} = useAudioRecorder(onChunk);

  return (
    <div className="p-4 border rounded-lg w-80 mx-auto mt-8 text-center">
      <h2>Audio Streamer</h2>
      <div className="flex gap-4 justify-center mt-4">
        <button onClick={() => start(1000)}>🎙 Start</button>
        <button onClick={stop}>⏹ Stop</button>
      </div>
    </div>
  );
}