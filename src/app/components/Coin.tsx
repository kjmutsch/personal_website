import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CoinProps {
  x: number;
  y: number;
  onCollect: () => void;
  backgroundPosition: number;
  id: number;
}

const Coin = ({ x, y, onCollect, backgroundPosition, id }: CoinProps) => {
  const [collected, setCollected] = useState(false);
  const isJumping = useSelector((state: RootState) => state.app.isJumping);
  const onPathOffset = 460;
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!collected) {
      const checkCollision = () => {
        const robotX = 100; // Robot's X position
        const robotHeight = -104; // body height
        const jumpHeight = isJumping ? -20 : 0; // Robot jump height
        const distanceThreshold = 30; // Distance for collection

        const coinScreenX = x + backgroundPosition; // Convert world position to screen position
        const closeEnoughX = Math.abs(robotX - coinScreenX) < distanceThreshold;
        const closeEnoughY = Math.abs((jumpHeight + robotHeight) - y) < distanceThreshold;

        if (closeEnoughX && closeEnoughY) {
          setCollected(true);
          onCollect();
          return;
        }

        // Keep checking using requestAnimationFrame
        animationFrameRef.current = requestAnimationFrame(checkCollision); // instead of useInterval
      };

      animationFrameRef.current = requestAnimationFrame(checkCollision);

      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [collected, x, y, onCollect, backgroundPosition, isJumping]);

  if (collected) return null;

  return (
    <img
      src="/images/objects/coin.png"
      alt="Coin"
      className="absolute"
      style={{
        left: `${x + backgroundPosition}px`,
        top: `${y + onPathOffset}px`,
        width: "50px",
        height: "50px",
        zIndex: 9,
      }}
    />
  );
};

export default Coin;