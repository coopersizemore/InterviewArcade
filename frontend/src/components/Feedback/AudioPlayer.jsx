import React, { useState, useRef, useEffect } from 'react';
import './FeedbackPage.css';

// SVG icons (no changes needed here)
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const LoadingSpinner = () => (
    <svg className="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);

// MODIFICATION 1: Changed prop from 'src' to 'audioData'
function AudioPlayer({ audioData, isLoading }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // MODIFICATION 2: Add state to hold the generated object URL
    const [objectUrl, setObjectUrl] = useState(null);

    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    // MODIFICATION 3: New useEffect to handle the binary data
    useEffect(() => {
        // Only run if we have new audio data
        if (audioData) {
            // Create a Blob from the binary data with the correct MIME type for MP3
            // const blob = new Blob([audioData], { type: 'audio/mpeg' });
            
            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(audioData);
            setObjectUrl(url);

            // Cleanup function to release the object URL and prevent memory leaks
            return () => {
                URL.revokeObjectURL(url);
                setObjectUrl(null);
            };
        }
    }, [audioData]); // This effect runs only when the audioData prop changes

    // This useEffect now depends on 'objectUrl' instead of 'src'
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !objectUrl) return;

        const setAudioData = () => {
            // Check if duration is a finite number before setting
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        // Reset state when new audio is loaded
        setIsPlaying(false);
        setCurrentTime(0);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, [objectUrl]); // Re-run if the objectUrl changes

    const togglePlayPause = () => {
        if (!audioRef.current || !objectUrl) return; // Don't do anything if there's no audio
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        if (isNaN(time) || time === 0) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    // ... (LoadingSpinner JSX is unchanged)
    if (isLoading) {
        return (
            <div className="audio-player loading">
                <LoadingSpinner />
                <span>Analyzing audio...</span>
            </div>
        );
    }
    
    // Don't render the player if there's no audio data yet
    if (!audioData) {
        return <div className="audio-player-placeholder">No audio loaded.</div>;
    }

    return (
        <div className="audio-player">
            {/* MODIFICATION 4: The 'src' attribute now uses the stateful objectUrl */}
            <audio ref={audioRef} src={objectUrl} preload="metadata"></audio>
            
            <button onClick={togglePlayPause} className="play-pause-btn" disabled={!objectUrl}>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <span className="time-display">{formatTime(currentTime)}</span>
            
            <input 
                type="range" 
                ref={progressBarRef}
                value={isNaN(currentTime) ? 0 : currentTime}
                max={isNaN(duration) ? 0 : duration}
                onChange={() => audioRef.current.currentTime = progressBarRef.current.value}
                className="progress-bar"
                disabled={!objectUrl}
            />

            <span className="time-display">{formatTime(duration)}</span>
        </div>
    );
}

export default AudioPlayer;