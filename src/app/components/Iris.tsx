import React, { useEffect, useState } from 'react';
import './Iris.css';

interface IrisProps {
  trigger: boolean;
}

const Iris: React.FC<IrisProps> = ({ trigger }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);

      // Hide the iris after the animation completes (4 seconds)
      setTimeout(() => {
        setIsVisible(false);
      }, 4000); // Total duration of the iris animation
    }
  }, [trigger]);

  if (!isVisible) return null;

  return (
    <div className="iris-container">
      <div className="iris"></div>
    </div>
  );
};

export default Iris;
