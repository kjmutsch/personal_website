import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface BackgroundProps {
  position: number;
  distantPosition: number;
  cloudPace: number;
  setCloudPosition: Dispatch<SetStateAction<number>>;
}

export default function BackgroundWrapper({ position, distantPosition, cloudPace, setCloudPosition }: BackgroundProps) {
  const [initialPosition, setInitialPosition] = useState(200);
  const [sunActive, setSunActive] = useState(true);
  const isMovingBackward = useSelector((state: RootState) => state.app.isMovingBackward);
  const isMovingForwards = useSelector((state: RootState) => state.app.isMovingForwards);


  const backgroundOpacityRef = useRef(0.7);
  const mountainBrightnessRef = useRef(1);
  const cloudBrightnessRef = useRef(1);

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  const sunWidth = 500; // Adjust this to match the actual width of the sun image
  const sunStartOffset = sunWidth * 1.5; // Extra offset to ensure it starts off-screen
  // Ensures the sun starts off screen
  const sunX = (((distantPosition + screenWidth + sunStartOffset) % (screenWidth + sunStartOffset * 2)) + sunStartOffset);

  // Parabolic arc for sun/moon movement
  const h = screenWidth / 2; // Midpoint of screen
  const startY = screenHeight / 2; // Sun starts/ends here
  const peakY = 0; // Top of arc
  const a = (startY - peakY) / Math.pow(h, 2);
  let sunY = a * Math.pow(-sunX - h, 2) + peakY;
  sunY = Math.min(Math.max(sunY, -startY), startY); // Clamp sunY

  const lastBrightnessRef = useRef(0.6); // Stores last brightness level when switching

  useEffect(() => {
    let animationFrameId: number;

    const updateBrightness = () => {
      const brightnessFactor = sunY / startY;

      const mediumDark = 0.6; // baseline for transitioning between night/day
      const brightAtZero = 1.0; // brightest when sun is at `sunY = 0`
      const darkAtZero = 0.3;

      if (sunY === startY) {
        lastBrightnessRef.current = mediumDark;
      }
      const brightnessValue = sunActive
        ? mediumDark + (brightAtZero - mediumDark) * (1 - Math.abs(brightnessFactor)) // ☀️ Sun brightens at `0`, then returns to medium
        : mediumDark - (mediumDark - darkAtZero) * (1 - Math.abs(brightnessFactor)); // 🌙 Moon darkens at `0`, then returns to medium

      // brightness is inverse of opacity
      backgroundOpacityRef.current += (brightnessValue - backgroundOpacityRef.current) * 0.6;
      mountainBrightnessRef.current += (brightnessValue - mountainBrightnessRef.current) * 0.6;
      cloudBrightnessRef.current += (brightnessValue - cloudBrightnessRef.current) * 0.6;
      animationFrameId = requestAnimationFrame(updateBrightness);
    };

    updateBrightness();

    return () => cancelAnimationFrame(animationFrameId);
  }, [sunY, sunActive]);

  useEffect(() => {
    if ((initialPosition - cloudPace) > screenWidth) { 
      setInitialPosition(-150);
      setCloudPosition(0);
    } else if (initialPosition - cloudPace < -150) {
      setInitialPosition(screenWidth);
      setCloudPosition(0);
    }
  }, [cloudPace]);

  const flippedSolar = useRef<boolean>(false);
  const forwardsAtFlip = useRef<boolean>(false);
  const forwardsCurr = useRef<boolean | undefined>();
  useEffect(()=> {
    // the first time sunY === startY we will mark it as flipped and flip it, we won't continue flipping it
    // while sunY === startY because someone could be standing still and we allow the sun to stay at startY for a while
    // while it floats off screen
    if(sunY === startY && !flippedSolar.current) {
      setSunActive(prev => !prev); // flip from sun to moon or vice versa
      flippedSolar.current = true // mark that we just flipped it
      forwardsAtFlip.current = isMovingForwards ? true : false; // save directon we were traveling at flip
    } else if (sunY !== startY) {
      // otherwise sunY is not at the end and we don't want the other useEffect to run
      flippedSolar.current = false;
    }
  }, [sunY]);

  useEffect(()=>{
    if(isMovingBackward) forwardsCurr.current = false; // currently moving forwards or not
    if(isMovingForwards) forwardsCurr.current = true;
  }, [isMovingBackward, isMovingForwards])

  // anytime someone switches directions while sunY === startY we flip it
  useEffect(() => {
    // we are at the flipping stage and we just changed directions in the middle of it
    if(flippedSolar.current && (forwardsAtFlip.current !== forwardsCurr.current)) { // we are at startY/point where we flip and user just changed directions
      setSunActive(prev => !prev); // we flipped directions so flip it back but only if the flag is set
      forwardsAtFlip.current = isMovingForwards ? true : false; // will be same as forwardsCurr until someone switches direction again
    }
  }, [forwardsCurr.current]) // fowards.current changed directions

  return (
    <>
      {/* Sky (Lowest layer) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          overflow: "hidden",
          backgroundImage: "url('/images/background/sky.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
        }}
      />

      {/* Dark Overlay (Only affects the sky) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 4, 
          backgroundColor: `rgba(0, 0, 0, ${1-backgroundOpacityRef.current})`,
          pointerEvents: "none",
        }}
      />

      {/* Moon / Sun (Behind mountains and clouds but in front of sky-darkening overlay) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <img 
          src={`/images/background/${sunActive ? "sun.png" : "moon.png"}`} 
          alt={sunActive ? "Sun" : "Moon"}
          className="absolute w-[100px] h-[100px]" 
          style={{ 
            top: `${sunY}px`,
            right: `${-sunX}px`, // ✅ Sun now **starts off-screen right** and exits left
          }} 
        />
      </div>

      {/* Mountains (Correct Brightness Inversion) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${distantPosition}px bottom`,
          zIndex: 6, 
          filter: `brightness(${mountainBrightnessRef.current})`,
        }}
      />

      {/* Clouds (Correct Brightness Inversion, Wraps Correctly) */}
      <img 
        src="/images/background/cloud.png" 
        alt="Cloud" 
        className="absolute"
        style={{ 
          position: "absolute",
          width: "150px", 
          height: "50px", 
          filter: `brightness(${cloudBrightnessRef.current})`,
          zIndex: 8, 
          right: `${initialPosition - cloudPace}px`,
          transform: "scaleX(-1)",
          top: "200px",
        }} 
      />

      {/* Background SVG (Topmost, should not be affected by overlay) */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 9, 
          overflow: "hidden",
          backgroundImage: "url('/images/background/background.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${position}px 0px`,
        }}
      />
    </>
  );
}
