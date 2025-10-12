import { useState, useRef, useCallback } from "react";

export default function useAudioRecorder(onChunk) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);

    const startAudio = useCallback(async () => {
        if (isRecording) {
            console.warn("Recording is already in progress.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    onChunk(event.data);
                }
            };
            recorder.start(10000);
            setIsRecording(true);
            console.log("Audio recording successfully started.");
        } catch (err) {
            console.error("Failed to start audio recording:", err);
            throw err;
        }
    }, [onChunk]); // <-- REMOVED isRecording from this array

    const stopAudio = useCallback(() => {
        if (!mediaRecorderRef.current) {
            return;
        }
        mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        console.log("Audio recording stopped.");
    }, []);

    return { startAudio, stopAudio, isRecording };
}
