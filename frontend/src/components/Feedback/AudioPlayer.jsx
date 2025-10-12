import React, { useState, useRef, useEffect } from 'react';
import './FeedbackPage.css'; // We'll add the styles to your existing CSS file

// SVG icons for play, pause, and loading
const PlayIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>;
const PauseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>;
const LoadingSpinner = () => (
    <svg className="spinner" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
);

function AudioPlayer({ src, isLoading }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef(null);
    const progressBarRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => setDuration(audio.duration);
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => setIsPlaying(false));
        };
    }, [src]); // Re-run if the audio source changes

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    if (isLoading) {
        return (
            <div className="audio-player loading">
                <LoadingSpinner />
                <span>Analyzing audio...</span>
            </div>
        );
    }

    return (
        <div className="audio-player">
            {/* The actual HTML audio element, hidden but controlled by our UI */}
            <audio ref={audioRef} src={src} preload="metadata"></audio>
            
            <button onClick={togglePlayPause} className="play-pause-btn">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <span className="time-display">{formatTime(currentTime)}</span>
            
            <input 
                type="range" 
                ref={progressBarRef}
                value={currentTime}
                max={duration || 0}
                onChange={() => audioRef.current.currentTime = progressBarRef.current.value}
                className="progress-bar"
            />

            <span className="time-display">{formatTime(duration)}</span>
        </div>
    );
}

export default AudioPlayer;