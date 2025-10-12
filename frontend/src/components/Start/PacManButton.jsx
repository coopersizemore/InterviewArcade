import React from 'react';
import './PacManButton.css';

// This component accepts an onClick prop to trigger the interview start logic
function PacManButton({ onClick }) {
  return (
    <div className="pacman-button-wrapper">
      <div className="arcade-machine">
        <div className="arcade-machine-title"></div>
        {/* The onClick handler is attached to the label */}
        <label onClick={onClick}>
          <div className="arcade-button" style={{'--button-label': "'Start'"}}>
            <input type="checkbox" id="input" />
            <div className="arcade-button-text"></div>
            <div className="ghost clyde"></div>
            <div className="pacman"></div>
            <div className="dots"></div>
            <div className="dots-v"></div>
            <div className="walls"></div>
          </div>
        </label>
      </div>
      <div className="ghosts-bar">
        <div className="ghosts">
          <div className="ghost blinky"></div>
          <div className="ghost clyde"></div>
          <div className="ghost inky"></div>
          <div className="ghost pinky"></div>
          <div className="ghost dizzied"></div>
        </div>
      </div>
    </div>
  );
}

export default PacManButton;