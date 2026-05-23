// Generic sprite-sheet animator; defaults to the 8-bit cat used as a mascot on the contact page.
"use client";
import { useEffect, useState } from "react";

interface SpriteAnimationProps {
  imageSrc?: string;
  spriteSize?: number;
  frameSize?: number;
  displaySize?: number;
  frameOrder?: number[];
  speed?: number;
}

const DEFAULT_JUMP_FRAMES = Array.from({ length: 36 }, (_, i) => i);

const SpriteAnimation = ({
  imageSrc = "/images/animations/8-bit-cat-sprite-sheet.png",
  spriteSize = 3840,
  frameSize = 640,
  displaySize = 96,
  frameOrder = DEFAULT_JUMP_FRAMES,
  speed = 50,
}: SpriteAnimationProps) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const framesPerRow = spriteSize / frameSize;
  const scale = displaySize / frameSize;
  const scaledSpriteSize = spriteSize * scale;

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frameOrder.length);
    }, speed);
    return () => clearInterval(interval);
  }, [frameOrder.length, speed]);

  const frameNumber = frameOrder[frameIndex];
  const row = Math.floor(frameNumber / framesPerRow);
  const col = frameNumber % framesPerRow;

  return (
    <div
      style={{
        width: `${displaySize}px`,
        height: `${displaySize}px`,
        backgroundImage: `url(${imageSrc})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${scaledSpriteSize}px ${scaledSpriteSize}px`,
        backgroundPosition: `-${col * displaySize}px -${row * displaySize}px`,
        imageRendering: "pixelated",
      }}
    />
  );
};

export default SpriteAnimation;
