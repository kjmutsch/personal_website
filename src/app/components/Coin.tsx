import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CoinProps {
  x: number;
  y: number;
  onCollect: () => void;
  backgroundPosition: number;
}

const Coin = ({ x, y, onCollect, backgroundPosition }: CoinProps) => {
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    if (!collected) {
      const checkCollision = () => {
        const robotX = 100; // Robot's X position
        const robotY = 55; // Robot's base Y position
        const jumpHeight = -20; // Robot jump height
        const distanceThreshold = 30; // Distance for collection

        const closeEnoughX = Math.abs(robotX - (x - backgroundPosition)) < distanceThreshold;
        const closeEnoughY = Math.abs(robotY + jumpHeight - y) < distanceThreshold;

        if (closeEnoughX && closeEnoughY) {
          setCollected(true);
          onCollect();
        }
      };

      const interval = setInterval(checkCollision, 50);
      return () => clearInterval(interval);
    }
  }, [collected, x, y, onCollect, backgroundPosition]);

  if (collected) return null;

  console.log('coin:' + x, backgroundPosition, x - backgroundPosition);

  return (
    <img
      src="/images/objects/coin.png"
      alt="Coin"
      className="absolute"
      style={{
        left: `${x + backgroundPosition}px`, // ✅ FIX: Properly move relative to the background
        top: `${y}px`,
        width: "30px",
        height: "30px",
        zIndex: 9999,
      }}
    />
  );
};

export default Coin;