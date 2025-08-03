import React, { useState, useEffect } from 'react';

function BackgroundShapes() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Har shape ke liye alag speed (multiplier)
  const multipliers = [0.01, 0.02, 0.015, 0.03, 0.025, 0.01, 0.02];

  return (
    <div className="shapes-container">
      {[...Array(7)].map((_, i) => {
        const x = (position.x - window.innerWidth / 2) * multipliers[i];
        const y = (position.y - window.innerHeight / 2) * multipliers[i];
        return (
          <div 
            key={i} 
            className={`shape-wrapper shape-wrapper-${i + 1}`}
            style={{
              transform: `translateX(${x}px) translateY(${y}px)`
            }}
          >
            <div className={`shape shape-${i + 1}`}></div>
          </div>
        );
      })}
    </div>
  );
}

export default BackgroundShapes;