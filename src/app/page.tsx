"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound';
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";
import BackgroundWrapper from "./components/BackgroundWrapper";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export default function Home() {
  const [play] = useSound('/LatinHouseBed.mp3');
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [distantBackgroundPosition, setDistantBackgroundPosition] = useState(0);
  const [cloudPosition, setCloudPosition] = useState(0);
  const [ready, setReady] = useState(false);

  const handleStart = async () => {
    play();
    setShowIris(true); // Trigger iris animation

    // After 1.8 seconds, hide Start and show just Background
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1800);

    setShowBackground(true);
    setOnStart(false); // Hide the Start button

    // Wait 4 seconds before setting 'ready' to true
    await delay(4000);
    setReady(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BackgroundWrapper 
        position={backgroundPosition} 
        cloudPace={cloudPosition} 
        distantPosition={distantBackgroundPosition} 
        setCloudPosition={setCloudPosition}
      />

      {onStart && (
        <div 
          className="absolute inset-0 w-full h-full bg-black bg-opacity-10 backdrop-blur-sm transition-opacity duration-500"
          style={{ zIndex: 99 }}
        />
      )}

      {onStart && (
        <div 
          className="absolute w-full h-full flex justify-center items-center"
          style={{ zIndex: 9999, pointerEvents: "auto" }}
        >
          <button onClick={handleStart} style={{ zIndex: 10000 }}>
            <Start />
          </button>
        </div>
      )}

      {showBackground && (
        <div>
          <TextBubble ready={ready} />
          <Robot 
            ready={ready} 
            setBackgroundPosition={setBackgroundPosition} 
            setCloudPosition={setCloudPosition} 
            setDistantBackgroundPosition={setDistantBackgroundPosition} 
          />
        </div>
      )}

      <Iris trigger={showIris} />

      <div style={{ display: 'none' }}>
        <AudioPlayer
          onFinish={() => {}}
          play={true}
          src="/LatinHouseBed.mp3"
        />
      </div>
    </div>
  );
}
