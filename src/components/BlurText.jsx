import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words'
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {elements.map((segment, index) => (
        <motion.span
          key={index}
          initial={{ 
            filter: 'blur(10px)', 
            opacity: 0, 
            y: -20 
          }}
          animate={inView ? { 
            filter: 'blur(0px)', 
            opacity: 1, 
            y: 0 
          } : {
            filter: 'blur(10px)', 
            opacity: 0, 
            y: -20 
          }}
          transition={{
            duration: 0.6,
            delay: (index * delay) / 1000,
            ease: 'easeOut'
          }}
          style={{ 
            display: 'inline-block',
            marginRight: animateBy === 'words' ? '0.3em' : '0'
          }}
        >
          {segment}
        </motion.span>
      ))}
    </div>
  );
};

export default BlurText;