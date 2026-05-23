// End-of-world flag: when the robot collides with it, the game ends.
"use client";
import { useEffect, useRef } from "react";

interface FlagProps {
  x: number;
  backgroundPosition: number;
  robotY: number;
  gameEnded: boolean;
  onReach: () => void;
}

const FLAG_WIDTH = 110;
const FLAG_HEIGHT = 110;

const Flag = ({ x, backgroundPosition, robotY, gameEnded, onReach }: FlagProps) => {
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (gameEnded) return;

    const checkCollision = () => {
      const robotX = 100;
      const robotWidth = 75;
      const flagScreenX = x + backgroundPosition;
      const robotCenterX = robotX + robotWidth / 2;
      const flagCenterX = flagScreenX + FLAG_WIDTH / 2;

      const overlapX = Math.abs(robotCenterX - flagCenterX) < (robotWidth + FLAG_WIDTH) / 2;
      if (overlapX) {
        onReach();
        return;
      }
      animationFrameRef.current = requestAnimationFrame(checkCollision);
    };

    animationFrameRef.current = requestAnimationFrame(checkCollision);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameEnded, x, backgroundPosition, onReach]);

  // Anchor the flag's bottom near the robot's ground level so the pole stands on the floor.
  const flagTop = robotY + 70 - FLAG_HEIGHT;

  return (
    <img
      src="/images/objects/flag.png"
      alt="Finish flag"
      className="absolute"
      style={{
        left: `${x + backgroundPosition}px`,
        top: `${flagTop}px`,
        width: `${FLAG_WIDTH}px`,
        height: `${FLAG_HEIGHT}px`,
        zIndex: 9,
        imageRendering: "pixelated",
      }}
      draggable={false}
    />
  );
};

export default Flag;
