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

  const sunWidth = 150;
  // Parabolic Movement
  const sunX = ((distantPosition % (screenWidth + sunWidth)) + sunWidth); // ✅ Ensures the sun starts off-screen
  const h = screenWidth / 2; // ✅ Midpoint where the sun reaches peak in X direction
  const startY = screenHeight / 2; // ✅ Ensures the sun starts & ends in the middle of the Y-axis
  const peakY = screenHeight * 0.3; // ✅ Peak height for a natural-looking arc
  const a = -(startY - peakY) / Math.pow(h, 2); // ✅ Fixing the calculation for proper descent

  // Compute the Y position using a parabolic equation
  const sunY = a * Math.pow(sunX - h, 2) + startY; // ✅ Ensures a smooth rise & fall

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

  console.log(sunX, sunY)
  return (
    <>
      <img src="/images/sun.png" alt='Sun' 
        className="absolute top-4 w-32 h-32"
        style={{ 
           top: `${Math.max(0, sunY)}px`,
          // top: `${sunY}px`,

          width: '125px',
          right: `${-sunX - 80}px`, // Moves horizontally
          zIndex: 3}}
      />
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          overflow: "hidden",
          backgroundImage: "url('/images/background/mountains.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: "repeat-x", // Ensure seamless tiling
          backgroundPosition: `${distantPosition}px 0px`, // Move background infinitely
       }}
      />
      <img src="/images/background/cloud.png" alt='Cloud' 
        className="absolute"
        style={{ zIndex: 2, 
          width: '150px', 
          height: '50px', 
          top: 200, 
          right: `${(initialPosition - cloudPace)}px`, // once it hits max width plus width of cloud, wrap around
          transform: "scaleX(-1)"}}
      />
      {/* <img src="/images/background/cloud.png" alt='Cloud' 
        className="absolute"
        style={{ zIndex: 2, top: 40,
          right: `${
            (((40 - distantPosition * 1.5 + 150) % (window.innerWidth + 150)))
          }px`
        }}
      /> */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          overflow: "hidden",
          backgroundImage: "url('/images/background/background.svg')",
          backgroundSize: 'cover',
          backgroundRepeat: "repeat-x", // Ensure seamless tiling
          backgroundPosition: `${position}px 0px`, // Move background infinitely
        }}
      />

    </>
  );
}