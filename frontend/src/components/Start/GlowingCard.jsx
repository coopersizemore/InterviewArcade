import React from 'react';
import './GlowingCard.css'; // Import the CSS file

function GlowingCard({onClick}) {

  return (
    <div className="card" onClick={onClick}>
      Start Interview!
    </div>
  );
}

export default GlowingCard;
