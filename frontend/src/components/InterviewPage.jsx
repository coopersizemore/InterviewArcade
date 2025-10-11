import React from "react"
import AudioStreamer from "../components/AudioStreamer";

export default function InterviewPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🎤 Interview Test Page</h1>
      <p>Click “Start” to test your microphone and stream audio chunks.</p>

      <AudioStreamer />

      <p style={{ marginTop: "1em", fontSize: "0.9em", color: "#555" }}>
        Open your browser console to see audio chunks being logged!
      </p>
    </div>
  );
}