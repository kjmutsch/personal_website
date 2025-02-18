"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound';
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";
import BackgroundWrapper from "./components/BackgroundWrapper";

export default function Home() {
  const [play] = useSound('/LatinHouseBed.mp3');
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [ready, setReady] = useState(false);
  const coinRate = 1000;

  const handleStart = async () => {
    // Play the sound and start the iris animation
    play();
    setShowIris(true); // Trigger the iris animation
  
    // After 1.8 seconds, hide Start and show just Background
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1800);

    setShowBackground(true); // Reveal the empty background
    setOnStart(false); // Hide the Start button
  
    // Wait an additional 4 seconds before setting 'ready' to true
    await delay(4000);
    setReady(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BackgroundWrapper position={backgroundPosition}/>

      {/* Initially, show the Start button */}
      {onStart && (
        <button onClick={handleStart}>
          <Start />
        </button>
      )}

      {showBackground &&
        <div>
          <TextBubble ready={ready} />
          <Robot ready={ready} setBackgroundPosition={setBackgroundPosition} />
        </div>
      }

      {/* Show Iris transition */}
      <Iris trigger={showIris} />

      {/* Hidden AudioPlayer */}
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
