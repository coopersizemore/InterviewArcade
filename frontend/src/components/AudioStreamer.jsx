import React, {useCallback, useState} from "react";
import useAudioRecorder from "../hooks/useAudioRecorder";

export default function AudioStreamer() {
  const onChunk = useCallback(async (blob) => {
    console.log("New audio chunk:", blob);
  }, []);

  const {start, stop} = useAudioRecorder(onChunk);

  return (
    <div>
        <button onClick={() => start(15000)}> Start Recording </button>
        <button onClick={stop}> Stop Recording </button>
    </div>
  );
}