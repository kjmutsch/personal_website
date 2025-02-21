import { useEffect, useState } from "react";

interface CoinProps {
  x: number;
  y: number;
  onCollect: () => void;
}

const Coin = ({ x, y, onCollect }: CoinProps) => {
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    if (!collected) {
      const checkCollision = () => {
        const robotX = 100; // Robot's X position (adjust if necessary)
        const robotY = 55; // Robot's base Y position
        const jumpHeight = -20; // Robot jump height
        const distanceThreshold = 30; // Distance for collection

        const closeEnoughX = Math.abs(robotX - x) < distanceThreshold;
        const closeEnoughY = Math.abs(robotY + jumpHeight - y) < distanceThreshold;

        if (closeEnoughX && closeEnoughY) {
          setCollected(true);
          onCollect();
        }
      };

      const interval = setInterval(checkCollision, 50);
      return () => clearInterval(interval);
    }
  }, [collected, x, y, onCollect]);

  if (collected) return null;

  return (
    <img
      src="/images/objects/coin.png"
      alt="Coin"
      className="absolute"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: "30px",
        height: "30px",
        zIndex: 10,
      }}
    />
  );
};

export default Coin;