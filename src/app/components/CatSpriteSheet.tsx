import React, { useState, useEffect } from "react";

const SpriteAnimation = ({
  imageSrc = "/images/animations/cat_jumping.png",
  spriteSize = 1024, // Size of the whole sprite sheet
  frameSize = 256, // Size of a single frame (assuming even spacing)
  frameOrder = [0, 4, 7, 2, 5, 8, 1, 6, 3], // Custom frame order (modify as needed)
  speed = 200, // Speed in milliseconds
}) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const framesPerRow = spriteSize / frameSize; // Assuming equal-sized frames

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameOrder.length);
    }, speed);
    return () => clearInterval(interval);
  }, [frameOrder.length, speed]);

  // Get the actual frame number from the custom order
  const frameNumber = frameOrder[frameIndex];

  // Calculate row and column
  const row = Math.floor(frameNumber / framesPerRow);
  const col = frameNumber % framesPerRow;

  return (
    <div
      style={{
        width: `${frameSize}px`,
        height: `${frameSize}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `-${col * frameSize}px -${row * frameSize}px`,
        imageRendering: "pixelated", // Optional for sharpness
      }}
    />
  );
};

export default SpriteAnimation;
