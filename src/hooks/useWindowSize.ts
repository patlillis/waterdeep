import { useState, useEffect } from 'react';

const useWindowSize = () => {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      // Set window width/height to state
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      if (window.innerHeight !== 0) {
        setAspectRatio(window.innerWidth / window.innerHeight);
      } else {
        setAspectRatio(0);
      }
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return { width, height, aspectRatio };
};

export default useWindowSize;
