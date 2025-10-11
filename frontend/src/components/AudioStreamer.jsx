import React, {useCallback, useState} from "react";
import useAudioRecorder from "../hooks/useAudioRecorder";

export default function AudioStreamer() {
  const onChunk = useCallback(async (blob) => {
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