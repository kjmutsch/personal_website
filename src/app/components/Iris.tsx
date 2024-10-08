// components/Iris.tsx
import React, { useEffect } from 'react';
import './iris.css'; // Import your CSS

interface IrisProps {
  trigger: boolean;
}

const Iris: React.FC<IrisProps> = ({ trigger }) => {
  return (
    <div className="iris-container">
      {trigger && <div className="iris"></div>}
    </div>
  );
};

export default Iris;
