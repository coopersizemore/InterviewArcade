import React from 'react';
import './GlowingCard.css'; // Import the CSS file

function GlowingCard({onClick}) {

  return (
    <div className="card" onClick={onClick}>
      CONFIRM
    </div>
  );
}

export default GlowingCard;
