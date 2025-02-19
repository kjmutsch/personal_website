import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface BackgroundProps {
  position: number;
  distantPosition: number;
  cloudPace: number;
  setCloudPosition: Dispatch<SetStateAction<number>>;
}

export default function BackgroundWrapper({ position, distantPosition, cloudPace, setCloudPosition }: BackgroundProps) {
  const [initialPosition, setInitialPosition] = useState(200);

  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

  const sunWidth = 125;
  const sunX = ((distantPosition % (screenWidth + sunWidth))); // Ensures looping

  // parabolic arc
  const h = screenWidth / 2; // Midpoint (where the sun peaks in X)
  const startY = (screenHeight / 2); // sun starts and ends here
  const peakY = 0; // 0 is the top
  const a = (startY-peakY) / Math.pow(h, 2);
  const sunY = a * Math.pow(-sunX - h, 2) + peakY;

  useEffect(() => {
    if((initialPosition - cloudPace) > window.innerWidth) { // it is off screen
      setInitialPosition(-150)
      setCloudPosition(0)
    } else if (initialPosition - cloudPace < -150) {
      setInitialPosition(window.innerWidth)
      setCloudPosition(0)
    }
  }, [
    cloudPace
  ])

  return (
    <>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          overflow: "hidden",
          backgroundImage: "url('/images/background/sky.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: "repeat-x",
        }}
      />

<div className="absolute inset-0 w-full h-full" style={{ zIndex: 4, pointerEvents: "none" }}>
        <img 
          src="/images/sun.png" 
          alt="Sun" 
          className="absolute w-[125px]" 
          style={{ 
            top: `${sunY}px`,
            right: `${-sunX - 80}px`, // Moves horizontally
            
          }} 
        />
      </div>

      <img 
        src="/images/background/mountains.png" 
        alt="Mountains" 
        className="absolute w-full bottom-0"
        style={{
          zIndex: 3, 
          top: '250px',
          left: `${distantPosition}px`,
        }}
      />

<div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 3, // ✅ Sun will now appear behind this but above the sky
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${distantPosition}px bottom`,
        }}
      />


      <img 
        src="/images/background/cloud.png" 
        alt='Cloud' 
        className="absolute"
        style={{ 
          zIndex: 4, 
          width: '150px', 
          height: '50px', 
          top: 200, 
          right: `${(initialPosition - cloudPace)}px`,
          transform: "scaleX(-1)"
        }} 
      />

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 5,
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