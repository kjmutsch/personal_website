import { useEffect, useMemo, useRef, useState } from "react";

interface BackgroundProps {
  position: number;
  distantPosition: number;
  startActive: boolean;
  isMovingBackwards: boolean;
  isMovingForwards: boolean;
}

export default function BackgroundWrapper({ position, distantPosition, startActive, isMovingBackwards, isMovingForwards }: BackgroundProps) {
  const [sunActive, setSunActive] = useState(true);

  // useRef values (don't trigger re-renders)
  const backgroundOpacityRef = useRef(0.7);
  const mountainBrightnessRef = useRef(1);
  const cloudBrightnessRef = useRef(1);
  const cloudPositionsRef = useRef<{ x: number; y: number; size: number; flip: boolean }[]>([]);
  const lastBrightnessRef = useRef(0.6);
  const flippedSolar = useRef<boolean>(false);
  const forwardsAtFlip = useRef<boolean>(false);
  const forwardsCurr = useRef<boolean | undefined>();
  const frameRef = useRef<number | null>(null);
  const prevDistantPositionRef = useRef(distantPosition); // prev mountain position
  const mountainPositionRef = useRef(distantPosition); // Track mountain position separately

  // Memoize window dimensions to prevent recalculation
  const { screenWidth, screenHeight } = useMemo(() => ({
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 1080
  }), []);
  
  // Memoize sun position calculations
  const { sunX, sunY, startY } = useMemo(() => {
    const sunWidth = 150;
    const sunStartOffset = sunWidth * 0.75;
    const x = (((distantPosition % (screenWidth + sunStartOffset * 2)) - sunStartOffset) + screenWidth / 3);
    const h = (screenWidth / 2.2);
    const sY = screenHeight * 0.6;
    const peakY = 0;
    const a = (sY - peakY) / Math.pow(h, 2);
    let y = a * Math.pow(x + h, 2) + peakY;
    y = Math.min(Math.max(y, -sY), sY);
    return { sunX: x, sunY: y, startY: sY };
  }, [distantPosition, screenWidth, screenHeight]);

  // Flip sun and moon logic
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
    if (isMovingBackwards) forwardsCurr.current = false;
    if (isMovingForwards) forwardsCurr.current = true;
  }, [isMovingBackwards, isMovingForwards]);

  useEffect(() => {
    if (flippedSolar.current && forwardsAtFlip.current !== forwardsCurr.current) {
      setSunActive((prev) => !prev);
      forwardsAtFlip.current = isMovingForwards;
    }
  }, [forwardsCurr.current]);

  // Brightness changes depending on if the sun is active or the moon and how high the particular luminary is in the sky
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

  // Cloud Initialization & Cloud Logic
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

    // Initialize mountain position
    mountainPositionRef.current = distantPosition;

    setTimeout(() => setFadeIn(false), 1500);
  }, []);

  // useEffect for cloud and mountain animations
  useEffect(() => {
    // Cancel any existing animation frame
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    
    // Initialize position tracking
    prevDistantPositionRef.current = distantPosition;
    let lastTimestamp = 0;
    
    // article & source link:https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
    const updateAnimations = (timestamp: number) => {
      // Calculate time delta for smoother animation, the time delta measures the elapsed time between animation frames
      // without time delta the animations run at different speeds on different browsers & devices,now actual frame rate doesn't matter
      // 60 fps is the universal smooth frame rate for animations 
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1; // Normalize to ~60fps, which takes approximately 16.67ms, we are converting milliseconds into frame units
      lastTimestamp = timestamp;
      
      // calculates deltaPosition for clouds and mountains
      let deltaPosition = (distantPosition - prevDistantPositionRef.current);

      // When moving, ensure we have a minimum movement amount to prevent stutter
      if (isMovingForwards || isMovingBackwards) {
        // Add a tiny bit of movement if we're supposed to be moving but delta is too small
        if (Math.abs(deltaPosition) < 0.1) {
          if (isMovingForwards) deltaPosition = -0.1;
          if (isMovingBackwards) deltaPosition = 0.1;
        }
      }
      
      // Update position reference
      prevDistantPositionRef.current = distantPosition;

      const speedMultiplier = 8.2;
      
      // Update mountain position using the same delta calculation as clouds
      mountainPositionRef.current += deltaPosition * speedMultiplier * deltaTime;
      
      // Move clouds based on movement direction and speed
      cloudPositionsRef.current = cloudPositionsRef.current.map((cloud) => {
        // Apply smooth movement with delta time
        let newX = cloud.x - deltaPosition * speedMultiplier * deltaTime;
        
        // Wrap clouds around screen edges
        if (newX < -cloud.size) {
          newX += screenWidth + cloud.size;
        } else if (newX > screenWidth) {
          newX -= screenWidth + cloud.size;
        }
        
        return { ...cloud, x: newX };
      });

      // Request next frame
      frameRef.current = requestAnimationFrame(updateAnimations);
    };
    
    // Start animation loop
    frameRef.current = requestAnimationFrame(updateAnimations);
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [distantPosition, isMovingForwards, isMovingBackwards, screenWidth]);

  // Extract current cloud positions for rendering
  const currentCloudPositions = cloudPositionsRef.current;
  // optimizations: willChange is used to alert the browser of styling changes that happen frequently
  // browser can promote the element to its own GPU layer and can optimize updates to the properties
  // BUT will change is really resource intensive, so if the character isn't moving then I turn it off
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
          willChange: isMovingBackwards || isMovingForwards ? 'background-color' : 'auto'
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
          style={{ top: `${sunY}px`, 
            right: `${-sunX}px`, 
            willChange: isMovingBackwards || isMovingForwards ? 'right, top' : 'auto' }}
        />
      </div>

      {/* Mountains */}
      <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${mountainPositionRef.current}px bottom`,
          zIndex: 6, 
          filter: !startActive ? `brightness(${mountainBrightnessRef.current})` : 'none',
          willChange: isMovingBackwards || isMovingForwards ? "background-position, filter" : 'auto',
        }}
      />

      {/* Clouds */}
      {currentCloudPositions.map((cloud, index) => (
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
            filter: !startActive ? `brightness(${mountainBrightnessRef.current})` : 'none',
            transform: cloud.flip ? "scaleX(-1)" : "none",
            willChange: isMovingBackwards || isMovingForwards ? "right, filter" : 'auto', // Optimize for animations
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
          willChange: isMovingBackwards || isMovingForwards ?  "background-position" : 'auto'
        }}
      />
    </>
  );
}