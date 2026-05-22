// Renders the parallax sky, mountains, clouds, and the sun/moon arc.
import { useEffect, useRef, useState } from "react";

interface BackgroundProps {
  position: number;
  distantPosition: number;
  startActive: boolean;
  isMovingBackwards: boolean;
  isMovingForwards: boolean;
}

// Sun/moon arc constants are in absolute pixels so the visual scale of the
// celestial body and the horizon line stay constant as the viewport shrinks.
const SUN_SIZE = 350;
const ARC_PEAK_OFFSET_FROM_TOP = 60;          // sun center y at the top of the arc
const ARC_HORIZON_OFFSET_FROM_BOTTOM = 220;   // sun center y at the horizon (off-screen entry/exit)
const SUN_CYCLE_LENGTH = 1100;                // distantPosition units per full sun→moon transit

export default function BackgroundWrapper({ position, distantPosition, startActive, isMovingBackwards, isMovingForwards }: BackgroundProps) {
  const [sunActive, setSunActive] = useState(true);
  const sunActiveRef = useRef(true);

  const backgroundOpacityRef = useRef(0.7);
  const mountainBrightnessRef = useRef(1);
  const cloudBrightnessRef = useRef(1);
  const cloudPositionsRef = useRef<{ x: number; y: number; size: number; flip: boolean }[]>([]);
  const frameRef = useRef<number | null>(null);
  const prevDistantPositionRef = useRef(distantPosition);
  const mountainPositionRef = useRef(distantPosition);
  const sunPositionRef = useRef({ x: 0, y: 0 });
  const [sunInit, setSunInit] = useState(false);
  const sunInitRef = useRef(false);

  // Track viewport size so the arc adapts on resize.
  const [{ screenWidth, screenHeight }, setScreenSize] = useState(() => ({
    screenWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
    screenHeight: typeof window !== "undefined" ? window.innerHeight : 1080,
  }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setScreenSize({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Cloud Initialization
  const cloudInitialPositions = [screenWidth * 0.2, screenWidth * 0.5, screenWidth * 0.8];
  const cloudYOffset = [220, -20, 120];
  const cloudSizes = [100, 240, 60];
  const [fadeIn, setFadeIn] = useState(true);

  // Initialize components
  useEffect(() => {
    cloudPositionsRef.current = cloudInitialPositions.map((pos, i) => ({
      x: pos,
      y: cloudYOffset[i],
      size: cloudSizes[i],
      flip: Math.random() < 0.5,
    }));

    mountainPositionRef.current = distantPosition;

    setTimeout(() => setFadeIn(false), 1500);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, []);

  // Main animation loop for all animated elements (cloud, mountain, sun/moon)
  useEffect(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    prevDistantPositionRef.current = distantPosition;
    let lastTimestamp = 0;

    // article & source link: https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
    const updateAnimations = (timestamp: number) => {
      // Normalize to ~60fps frame units so movement speed is independent of refresh rate.
      const deltaTime = lastTimestamp ? (timestamp - lastTimestamp) / 16.67 : 1;
      lastTimestamp = timestamp;

      let deltaPosition = distantPosition - prevDistantPositionRef.current;

      // Floor the delta when the player is actively moving so a stalled frame
      // doesn't cause a hitch in the parallax / cloud motion.
      if (isMovingForwards || isMovingBackwards) {
        if (Math.abs(deltaPosition) < 0.1) {
          if (isMovingForwards) deltaPosition = -0.1;
          if (isMovingBackwards) deltaPosition = 0.1;
        }
      }

      prevDistantPositionRef.current = distantPosition;
      const speedMultiplier = 8.2;
      mountainPositionRef.current += deltaPosition * speedMultiplier * deltaTime;

      // --- Sun / moon arc ---
      // Moving forward decreases distantPosition; we want the body to enter from
      // off-screen-right (phase 0), peak overhead (phase 0.5), and exit off-screen-left (phase 1).
      // Each full cycle alternates between sun and moon. cycleIndex naturally handles
      // direction reversal: walking backward decrements it and brings the previous body back.
      const cycle = -distantPosition / SUN_CYCLE_LENGTH;
      const cycleIndex = Math.floor(cycle);
      const phase = cycle - cycleIndex; // [0, 1)

      const horizonCenterY = screenHeight - ARC_HORIZON_OFFSET_FROM_BOTTOM;
      const peakCenterY = ARC_PEAK_OFFSET_FROM_TOP;

      // Horizontal: sun center sweeps linearly from just-off-right to just-off-left.
      const centerX = (screenWidth + SUN_SIZE / 2) - phase * (screenWidth + SUN_SIZE);

      // Vertical: parabola that equals 0 at the endpoints and 1 at the peak.
      const arch = 1 - Math.pow(2 * phase - 1, 2);
      const centerY = horizonCenterY - (horizonCenterY - peakCenterY) * arch;

      sunPositionRef.current = {
        x: centerX - SUN_SIZE / 2,
        y: centerY - SUN_SIZE / 2,
      };

      if (!sunInitRef.current) {
        sunInitRef.current = true;
        setSunInit(true);
      }

      // Alternate between sun and moon each cycle. Mod handles negative cycleIndex
      // (player walked backward past the start).
      const cycleMod = ((cycleIndex % 2) + 2) % 2;
      const shouldBeSun = cycleMod === 0;
      if (sunActiveRef.current !== shouldBeSun) {
        sunActiveRef.current = shouldBeSun;
        setSunActive(shouldBeSun);
      }

      // Brightness: medium-dark at horizon, brightens toward the peak (or darkens for the moon).
      const mediumDark = 0.6;
      const brightAtPeak = 1.0;
      const darkAtPeak = 0.3;
      const targetBrightness = shouldBeSun
        ? mediumDark + (brightAtPeak - mediumDark) * arch
        : mediumDark - (mediumDark - darkAtPeak) * arch;

      backgroundOpacityRef.current += (targetBrightness - backgroundOpacityRef.current) * 0.6;
      mountainBrightnessRef.current += (targetBrightness - mountainBrightnessRef.current) * 0.6;
      cloudBrightnessRef.current += (targetBrightness - cloudBrightnessRef.current) * 0.6;

      // Update cloud positions
      cloudPositionsRef.current = cloudPositionsRef.current.map((cloud) => {
        let newX = cloud.x - deltaPosition * speedMultiplier * deltaTime;
        if (newX < -cloud.size) {
          newX += screenWidth + cloud.size;
        } else if (newX > screenWidth) {
          newX -= screenWidth + cloud.size;
        }
        return { ...cloud, x: newX };
      });

      frameRef.current = requestAnimationFrame(updateAnimations);
    };

    frameRef.current = requestAnimationFrame(updateAnimations);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [distantPosition, isMovingForwards, isMovingBackwards, screenWidth, screenHeight]);

  const currentCloudPositions = cloudPositionsRef.current;
  const { x: sunX, y: sunY } = sunPositionRef.current;
  const isMoving = isMovingBackwards || isMovingForwards;

  return (
    <>
      {/* Sky */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          overflow: "hidden",
          backgroundImage: "url('/images/background/sky.svg')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Brightness Overlay */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 4,
          backgroundColor: `rgba(0, 0, 0, ${startActive ? 0 : 1 - backgroundOpacityRef.current})`,
          pointerEvents: "none",
          willChange: isMoving ? 'background-color' : 'auto'
        }}
      />

      {/* Sun & Moon */}
      <div className="absolute inset-0 w-full h-full"
        style={{ zIndex: 5, pointerEvents: "none" }}
      >
        <img
          src={`/images/background/${sunActive ? "sun.png" : "moon.png"}`}
          alt={sunActive ? "Sun" : "Moon"}
          className="absolute"
          style={{
            width: `${SUN_SIZE}px`,
            height: `${SUN_SIZE}px`,
            top: `${sunY}px`,
            left: `${sunX}px`,
            willChange: isMoving ? 'left, top' : 'auto',
            display: !sunInit ? 'none' : ''
          }}
        />
      </div>

      {/* Mountains */}
      <div className="absolute inset-0 w-full h-full" style={{
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${mountainPositionRef.current}px bottom`,
          zIndex: 6,
          filter: !startActive ? `brightness(${mountainBrightnessRef.current})` : 'none',
          willChange: isMoving ? "background-position, filter" : 'auto',
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
            filter: !startActive ? `brightness(${cloudBrightnessRef.current})` : 'none',
            transform: cloud.flip ? "scaleX(-1)" : "none",
            willChange: isMoving ? "right, filter" : 'auto',
          }}
        />
      ))}

      {/* Background */}
      <div className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 9,
          backgroundImage: "url('/images/background/background.svg')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${position}px 0px`,
          willChange: isMoving ? "background-position" : 'auto'
        }}
      />
    </>
  );
}
