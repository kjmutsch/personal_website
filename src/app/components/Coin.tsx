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
        const robotY = 55; // Default Y position (groundYPosition from Robot component)
        const jumpOffset = isJumping ? 75 : 0; // Approximate offset when jumping
        
        // Robot hitbox dimensions
        const robotWidth = 70; // Approx width of robot
        const robotHeight = 100; // Approx height of robot
        
        // Coin hitbox dimensions
        const coinWidth = 50;
        const coinHeight = 50;
        
        // Calculate robot position with jump offset
        const robotYPosition = robotY - jumpOffset;
        
        // Convert coin world position to screen position
        const coinScreenX = x + backgroundPosition;
        const coinScreenY = y;
        
        // Check for overlap between robot and coin hitboxes
        const overlapX = Math.abs(robotX - coinScreenX) < (robotWidth + coinWidth) / 2;
        const overlapY = Math.abs((robotYPosition + (robotHeight / 2)) - coinScreenY) < (robotHeight + coinHeight) / 2;

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
        top: `${y + onPathOffset}px`,
        width: "50px",
        height: "50px",
        zIndex: 9,
      }}
    />
  );
};

export default Coin;