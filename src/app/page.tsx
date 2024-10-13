"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Background from "./components/Background";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound';
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";

export default function Home() {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);
  const [play] = useSound('/LatinHouseBed.mp3');
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation
  const [ready, setReady] = useState(false);

  const handleStart = async () => {
    // Play the sound and start the iris animation
    play();
    setShowIris(true); // Trigger the iris animation
  
    // Delay helper function using Promise
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
    // After 1.8 seconds, hide Start and show just Background
    await delay(1800);
    setShowBackground(true); // Reveal the empty background
    setOnStart(false); // Hide the Start button
  
    // Wait an additional 4 seconds before setting 'ready' to true
    await delay(4000);
    setReady(true); // Set ready to true after 4 seconds
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Background />

      {/* Initially, show the Start button */}
      {onStart && (
        <button onClick={handleStart}>
          <Start />
        </button>
      )}

      {showBackground &&
        <div>
                    <TextBubble ready={ready} />
          <Robot ready={ready} />
        </div>
      }

      {/* Show Iris transition */}
      <Iris trigger={showIris} />

      {/* Hidden AudioPlayer */}
      <div style={{ display: 'none' }}>
        <AudioPlayer
          onFinish={() => setPlaySubmitSound(false)}
          play={true}
          src="/LatinHouseBed.mp3"
        />
      </div>
    </div>
  );
}
