import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CoinProps {
  x: number;
  y: number;
  onCollect: () => void;
  backgroundPosition: number;
  id: number;
  robotY: number;
}

const Coin = ({ x, y, onCollect, backgroundPosition, id, robotY }: CoinProps) => {
  const [collected, setCollected] = useState(false);
  const isJumping = useSelector((state: RootState) => state.app.isJumping);
  const animationFrameRef = useRef<number | null>(null);

  const coinWidth = 50;
  const coinHeight = 50;

  useEffect(() => {
    if (!collected) {
      const checkCollision = () => {
        const whiteSpaceCoin = 10 // about 10px of whitespace around the coin
        const robotYCenter = 70 / 2
        const robotX = 100; // Robot's X position offset
        const jumpOffset = isJumping ? 20 + robotYCenter : 0; // Approximate offset when jumping
        
        // Robot hitbox dimensions
        const robotWidth = 75; // Approx width of robot
        
        // Calculate robot position with jump offset
        const robotYPosition = robotY - jumpOffset;

        // Convert coin world position to screen position
        const coinScreenX = x + backgroundPosition;

        // Calculate centers of both objects
        const robotCenterX = robotX + (robotWidth / 2);
        const coinCenterX = coinScreenX + (coinWidth / 2);
        const coinBottom = y - whiteSpaceCoin  ;
        //console.log(id, robotY, y) // 379, 359

        // Check for overlap between robot and coin hitboxes
        const overlapX = Math.abs(robotCenterX - coinCenterX) < (robotWidth + coinWidth) / 2;
        const overlapY = robotYPosition <= coinBottom;
        //console.log(id, overlapY, robotYPosition, coinBottom)
        // 1 false 107 55 0 50 104
        //console.log(robotYPosition, robotY, jumpOffset, coinScreenY,overlapX, overlapY)

        if (overlapX && overlapY) {
          setCollected(true);
          onCollect();
          return;
        }

        // Keep checking using requestAnimationFrame
        animationFrameRef.current = requestAnimationFrame(checkCollision);
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
        top: `${y}px`,
        width: `${coinWidth}px`,
        height: `${coinHeight}px`,
        zIndex: 9,
      }}
    />
  );
};

export default Coin;