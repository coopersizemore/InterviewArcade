import React from 'react';
import './FeedbackPage.css'; // We'll add the new class here

// This component takes the image source (src) and positioning styles as props
function Sprite({ src, style, alt = 'arcade sprite' }) {
  return (
    <img
      src={src}
      alt={alt}
      className="arcade-sprite"
      style={style} // Apply inline styles for unique positioning
    />
  );
}

export default Sprite;