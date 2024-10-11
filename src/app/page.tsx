"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Background from "./components/Background";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound';
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";

export default function Home() {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);
  const [play] = useSound('/LatinHouseBed.mp3');
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation

  const handleStart = () => {
    // Play the sound and start the iris animation
    play();
    setShowIris(true); // Trigger the iris animation

    // After 1.8 seconds, hide Start and show Background
    setTimeout(() => {
      setShowBackground(true); // Reveal the background
      setOnStart(false); // Hide the Start button
    }, 1800); // Iris closing duration

    // After 4 seconds, hide the iris animation
    setTimeout(() => {
      setShowIris(false); // Hide iris animation after it's done
    }, 4000); // Full animation duration
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

      {showBackground && <Robot />}

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
