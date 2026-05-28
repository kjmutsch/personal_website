// End-of-world flag: when the robot collides with it, the game ends.
"use client";
import { useEffect, useRef } from "react";

interface FlagProps {
  x: number;
  backgroundPosition: number;
  robotY: number;
  scale: number;
  gameEnded: boolean;
  onReach: () => void;
}

const FLAG_WIDTH = 110;
const FLAG_HEIGHT = 110;

const Flag = ({ x, backgroundPosition, robotY, scale, gameEnded, onReach }: FlagProps) => {
  const animationFrameRef = useRef<number | null>(null);

  const flagWidth = FLAG_WIDTH * scale;
  const flagHeight = FLAG_HEIGHT * scale;

  useEffect(() => {
    if (gameEnded) return;

    const checkCollision = () => {
      const robotX = 100;
      const robotWidth = 75 * scale;
      const flagScreenX = x + backgroundPosition;
      const robotCenterX = robotX + robotWidth / 2;
      const flagCenterX = flagScreenX + flagWidth / 2;

      const overlapX = Math.abs(robotCenterX - flagCenterX) < (robotWidth + flagWidth) / 2;
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
  }, [gameEnded, x, backgroundPosition, onReach, scale, flagWidth]);

  // Anchor the flag's bottom to the robot's ground level. The 70px offset is
  // tuned for scale=1; scaling it keeps the flag-vs-wheels alignment consistent
  // as the robot shrinks/grows with the viewport.
  const flagTop = robotY + 70 * scale - flagHeight;

  return (
    <img
      src="/images/objects/flag.png"
      alt="Finish flag"
      className="absolute"
      style={{
        left: `${x + backgroundPosition}px`,
        top: `${flagTop}px`,
        width: `${flagWidth}px`,
        height: `${flagHeight}px`,
        zIndex: 9,
        imageRendering: "pixelated",
      }}
      draggable={false}
    />
  );
};

export default Flag;
