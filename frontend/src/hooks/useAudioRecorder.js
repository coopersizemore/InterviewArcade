import {useEffect, useRef} from "react";

export default function useAudioRecorder(onChunk) {
    const recorderRef = useRef(null);

    useEffect(() => {
        async function setup() {
            const stream = await navigator.mediaDevices.getUserMedia({audio: true});
            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            recorder.ondataavailable = (event) => onChunk(event.data);
        }
        setup();
    }, [onChunk]);

    function startAudio() {
        // 15000 milliseconds is 15 seconds
        recorderRef.current?.start(15000);
    }

    function stopAudio() {
        recorderRef.current?.stop();
    }

    return {startAudio, stopAudio};
}