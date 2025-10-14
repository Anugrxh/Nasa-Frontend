import { useEffect, useRef, useState } from 'react';
import './BlurText.css';

const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Start animation immediately after component mounts
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
      setInView(true); // Start animation immediately
    }, 200);

    return () => {
      clearTimeout(loadTimer);
    };
  }, []);

  if (!isLoaded) {
    // Show static text while loading to prevent flash
    return (
      <div className={className} style={{ opacity: 0 }}>
        {text}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`${className} blur-text-container`}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {elements.map((segment, index) => (
        <span
          key={index}
          className={`blur-text-segment ${inView ? 'animate' : ''}`}
          style={{ 
            animationDelay: `${(index * delay) / 1000}s`,
            marginRight: animateBy === 'words' ? '0.3em' : '0'
          }}
        >
          {segment}
        </span>
      ))}
    </div>
  );
};

export default BlurText;