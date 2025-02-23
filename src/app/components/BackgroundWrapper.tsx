import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface BackgroundProps {
  position: number;
  distantPosition: number;
  startActive: boolean;
  cloudPace: number;
}

export default function BackgroundWrapper({ position, distantPosition, startActive, cloudPace }: BackgroundProps) {
  const [sunActive, setSunActive] = useState(true);
  const isMovingBackward = useSelector((state: RootState) => state.app.isMovingBackward);
  const isMovingForwards = useSelector((state: RootState) => state.app.isMovingForwards);

  const backgroundOpacityRef = useRef(0.7);
  const mountainBrightnessRef = useRef(1);
  const cloudBrightnessRef = useRef(1);
  const cloudPositionsRef = useRef<{ x: number; y: number; size: number; flip: boolean }[]>([]);

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  // **Sun/Moon Calculation**
  const sunWidth = 150;
  const sunStartOffset = sunWidth * 0.75;
  const sunX = (((distantPosition % (screenWidth + sunStartOffset * 2)) - sunStartOffset) + screenWidth / 3);
  const h = (screenWidth / 2.2);
  const startY = screenHeight * 0.6;
  const peakY = 0;
  const a = (startY - peakY) / Math.pow(h, 2);
  let sunY = a * Math.pow(sunX + h, 2) + peakY;
  sunY = Math.min(Math.max(sunY, -startY), startY);

  const lastBrightnessRef = useRef(0.6);
  const flippedSolar = useRef<boolean>(false);
  const forwardsAtFlip = useRef<boolean>(false);
  const forwardsCurr = useRef<boolean | undefined>();

  // **Flip sun and moon logic**
  useEffect(() => {
    if (sunY >= startY && !flippedSolar.current) {
      setSunActive((prev) => !prev);
      flippedSolar.current = true;
      forwardsAtFlip.current = isMovingForwards;
    } else if (sunY < startY) {
      flippedSolar.current = false;
    }
  }, [sunY]);

  useEffect(() => {
    if (isMovingBackward) forwardsCurr.current = false;
    if (isMovingForwards) forwardsCurr.current = true;
  }, [isMovingBackward, isMovingForwards]);

  useEffect(() => {
    if (flippedSolar.current && forwardsAtFlip.current !== forwardsCurr.current) {
      setSunActive((prev) => !prev);
      forwardsAtFlip.current = isMovingForwards;
    }
  }, [forwardsCurr.current]);

  // **Brightness Adjustments**
  useEffect(() => {
    let animationFrameId: number;

    const updateBrightness = () => {
      const brightnessFactor = sunY / startY;
      const mediumDark = 0.6;
      const brightAtZero = 1.0;
      const darkAtZero = 0.3;

      if (sunY === startY) {
        lastBrightnessRef.current = mediumDark;
      }
      const brightnessValue = sunActive
        ? mediumDark + (brightAtZero - mediumDark) * (1 - Math.abs(brightnessFactor))
        : mediumDark - (mediumDark - darkAtZero) * (1 - Math.abs(brightnessFactor));

      backgroundOpacityRef.current += (brightnessValue - backgroundOpacityRef.current) * 0.6;
      mountainBrightnessRef.current += (brightnessValue - mountainBrightnessRef.current) * 0.6;
      cloudBrightnessRef.current += (brightnessValue - cloudBrightnessRef.current) * 0.6;

      animationFrameId = requestAnimationFrame(updateBrightness);
    };

    updateBrightness();
    return () => cancelAnimationFrame(animationFrameId);
  }, [sunY, sunActive]);

  // **Cloud Initialization**
  const cloudInitialPositions = [screenWidth * 0.2, screenWidth * 0.5, screenWidth * 0.8]; // Dynamic X positions
  const cloudYOffset = [220, -20, 120]; // Y positions
  const cloudSizes = [100, 240, 60]; // Widths
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    cloudPositionsRef.current = cloudInitialPositions.map((pos, i) => ({
      x: pos,
      y: cloudYOffset[i],
      size: cloudSizes[i],
      flip: Math.random() < 0.5,
    }));

    setTimeout(() => setFadeIn(false), 1500);
  }, []);

  // **Smooth Cloud Movement with requestAnimationFrame**
  const prevPositionRef = useRef(position);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const updateClouds = () => {
      const deltaPosition = position - prevPositionRef.current;
      prevPositionRef.current = position;

      cloudPositionsRef.current = cloudPositionsRef.current.map((cloud) => {
        let newX = cloud.x - deltaPosition * 0.3; // **✅ Adjusted for smoother movement**

        // **Wrap clouds around screen edges**
        if (newX < -cloud.size) {
          newX += screenWidth + cloud.size;
        } else if (newX > screenWidth) {
          newX -= screenWidth + cloud.size;
        }

        return { ...cloud, x: newX };
      });

      frameRef.current = requestAnimationFrame(updateClouds);
    };

    frameRef.current = requestAnimationFrame(updateClouds);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [position]);

  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          overflow: "hidden",
          backgroundImage: "url('/images/background/sky.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Brightness Overlay */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 4, 
          backgroundColor: `rgba(0, 0, 0, ${startActive ? 0 : 1 - backgroundOpacityRef.current})`,
          pointerEvents: "none",
        }}
      />

      {/* Sun & Moon */}
      <div className="absolute inset-0 w-full h-full"
        style={{ zIndex: 5, pointerEvents: "none" }}
      >
        <img 
          src={`/images/background/${sunActive ? "sun.png" : "moon.png"}`} 
          alt={sunActive ? "Sun" : "Moon"}
          className="absolute w-[350px] h-[350px]" 
          style={{ top: `${sunY}px`, right: `${-sunX}px` }}
        />
      </div>

      {/* Clouds */}
      {cloudPositionsRef.current.map((cloud, index) => (
        <img 
          key={index}
          src="/images/background/cloud.png"
          alt="Cloud"
          className="absolute transition-opacity duration-1000 ease-in"
          style={{
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.5}px`,
            opacity: fadeIn ? 0 : 1,
            zIndex: 8,
            right: `${cloud.x}px`,
            top: `${cloud.y}px`,
            transform: cloud.flip ? "scaleX(-1)" : "none",
          }}
        />
      ))}

      {/* Background */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 9,
          backgroundImage: "url('/images/background/background.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${position}px 0px`,
        }}
      />
    </>
  );
}
