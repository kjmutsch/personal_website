"use client"; // This is a client component 👈🏽
import { useEffect, useState } from "react";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound';
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";
import BackgroundWrapper from "./components/BackgroundWrapper";
import Link from "next/link";
import Coin from "./components/Coin";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Home() {
  const [play] = useSound('/LatinHouseBed.mp3');
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [distantBackgroundPosition, setDistantBackgroundPosition] = useState(0);
  const [cloudPosition, setCloudPosition] = useState(0);
  const [ready, setReady] = useState(false);

  const isMovingBackward = useSelector((state: RootState) => state.app.isMovingBackward);

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

  // Create coin pattern
  const coinRate = 5000; // every 500px
  const coinYOffset = [0, -50, -100] // place the coins in different spots on y axis
  const [coins, setCoins] = useState<{ x: number; y: number; id: number }[]>([]);
  
  // Calculate the visible coins based on robot position
  const numCoins = 10; // preload a few extra than will be on screen
  useEffect(() => {
    if (!isMovingBackward) {
      setCoins((prevCoins) => {
        const newCoins = Array.from({ length: numCoins }, (_, i) => {
          const xPosition = backgroundPosition + (i * coinRate);
          return { x: xPosition, y: coinYOffset[i % coinYOffset.length], id: xPosition };
        }).filter((coin) => !prevCoins.some((c) => c.id === coin.id));

        return [...prevCoins, ...newCoins];
      });
    }
  }, [backgroundPosition, isMovingBackward]);

  const handleCollectCoin = (coinId: number) => {
    setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId)); // Remove collected coin
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Link href="/resume" style={{position: 'absolute', zIndex: 99999}}>
        <button className="start-button">Go to Resume</button>
      </Link>
      <BackgroundWrapper 
        position={backgroundPosition} 
        cloudPace={cloudPosition} 
        distantPosition={distantBackgroundPosition} 
        setCloudPosition={setCloudPosition}
        startActive={onStart}
      />

      {/* Coins */}
      {/* {coins.map((coin) => (
        <Coin key={coin.id} x={coin.x - backgroundPosition} y={coin.y} onCollect={() => handleCollectCoin(coin.id)} />
      ))} */}

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