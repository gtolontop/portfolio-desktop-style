import React, { useState, useEffect } from 'react';
import '../styles/BootAnimation.css';

interface BootAnimationProps {
  onComplete: () => void;
}

const BootAnimation: React.FC<BootAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowLogo(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showLogo) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(onComplete, 500);
            }, 300);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [showLogo, onComplete]);

  return (
    <div className={`boot-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="boot-container">
        {showLogo && (
          <>
            <div className="boot-logo">
              <div className="logo-circle">
                <div className="logo-inner">
                  <span className="logo-text">CM</span>
                </div>
                <div className="logo-ring"></div>
              </div>
            </div>
            
            <div className="boot-text">PORTFOLIO OS</div>
            
            <div className="loading-container">
              <div className="loading-bar">
                <div 
                  className="loading-progress" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="loading-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
            
            <div className="system-info">
              <div className="info-line">Initializing system...</div>
              <div className="info-line">Loading components {progress}%</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BootAnimation;