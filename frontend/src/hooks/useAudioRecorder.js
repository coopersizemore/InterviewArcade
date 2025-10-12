import {useEffect, useRef} from "react";

export default function useAudioRecorder(onChunk) {
    const recorderRef = useRef(null);

    useEffect(() => {
        console.log("Setting up audio recorder")
        async function setup() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            recorder.ondataavailable = (event) => onChunk(event.data);
        }
        setup();
    }, []);

    function startAudio() {
        console.log("Starting")
        // 1000 milliseconds is 1 second
        // 60,000 represents 1 minute
        recorderRef.current?.start(20000);
    }

    function stopAudio() {
        recorderRef.current?.stop();
    }

    return {startAudio, stopAudio};
}