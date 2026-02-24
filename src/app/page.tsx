"use client"; // This is a client component 👈🏽
import { useEffect, useRef, useState } from "react";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import useSound from "use-sound";
import Iris from "./components/Iris"; // Import Iris
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";
import BackgroundWrapper from "./components/BackgroundWrapper";
import Link from "next/link";
import Coin from "./components/Coin";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function Home() {
  const [play] = useSound("/LatinHouseBed.mp3");
  const [onStart, setOnStart] = useState(true); // Show the Start button initially
  const [showIris, setShowIris] = useState(false); // Trigger iris animation
  const [showBackground, setShowBackground] = useState(false); // Show background after animation
  const [backgroundPosition, setBackgroundPosition] = useState(0);
  const [distantBackgroundPosition, setDistantBackgroundPosition] = useState(0);
  const [ready, setReady] = useState(false);
  const [robotY, setRobotY] = useState(0);

  const isMovingBackwards = useSelector((state: RootState) => state.app.isMovingBackwards);
  const isMovingForwards = useSelector((state: RootState) => state.app.isMovingForwards);

  // Calculate scale factor based on viewport height
  const SVG_BASE_HEIGHT = 771;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
  const scale = screenHeight / SVG_BASE_HEIGHT;

  const handleStart = async () => {
    play();
    console.log('pressed')
    setShowIris(true); // Trigger iris animation

    // After 1.8 seconds, hide Start and show just Background
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1800);

    setShowBackground(true);
    setOnStart(false); // Hide the Start button

    // Wait 4 seconds before setting 'ready' to true
    await delay(4000);
    setReady(true);
  };

  // Create coin pattern
  const coinRate = 500; // every 500px
  const coinYOffset = [50, -20, -10]; // place the coins in different spots on y axis
  const [coins, setCoins] = useState<{ x: number; y: number; id: number }[]>([]);
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;

  // Calculate the visible coins based on robot position
  const lastGeneratedSegment = useRef(Math.floor(-backgroundPosition / coinRate)); // track last segment where coin was generated
  const lastCoinIndex = useRef(0); // track last used height index for cycling

  // console.log("Background Position:", backgroundPosition);
  // console.log("Last Segment:", lastGeneratedSegment.current, "Next Segment:", lastGeneratedSegment.current * coinRate + coinRate);

  useEffect(() => {
    const currentSegment = Math.floor(backgroundPosition / -coinRate);
  
    //console.log("Checking Coin Spawn - Current Segment:", currentSegment, "Last Generated:", lastGeneratedSegment.current);
  
    if (!isMovingBackwards && currentSegment > lastGeneratedSegment.current) {
      lastGeneratedSegment.current = currentSegment;
  
      // Cycle coin height properly
      const nextHeightIndex = lastCoinIndex.current % coinYOffset.length;
      lastCoinIndex.current++;
  
      setCoins((prevCoins) => {
        const filteredCoins = prevCoins.filter((coin) => coin.x > -backgroundPosition - screenWidth * 1.5);
  
        const newCoin = {
          x: -backgroundPosition + screenWidth,
          y: robotY + coinYOffset[nextHeightIndex],
          id: currentSegment, // Unique ID based on segment
        };
  
        return [...filteredCoins, newCoin];
      });
    }
  }, [backgroundPosition, isMovingBackwards, robotY]);
  
  const handleCollectCoin = (coinId: number) => {
    setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId)); // Remove collected coin
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* <Link href="/resume" style={{ position: "absolute", zIndex: 99999 }}>
        <button className="start-button">Go to Resume</button>
      </Link> */}

      <BackgroundWrapper
        position={backgroundPosition}
        distantPosition={distantBackgroundPosition}
        startActive={onStart}
        isMovingBackwards={isMovingBackwards}
        isMovingForwards={isMovingForwards}
      />

      {/* Coins */}
      {coins
      .filter((coin) => coin.x + backgroundPosition > -100 && coin.x + backgroundPosition < screenWidth + 100) // ✅ Only render visible coins
      .map((coin) => (
        <Coin key={coin.id} id={coin.id} backgroundPosition={backgroundPosition} x={coin.x} y={coin.y} robotY={robotY} onCollect={() => handleCollectCoin(coin.id)} />
      ))}


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
          <TextBubble ready={ready} scale={scale} />
          <Robot
            ready={ready}
            setBackgroundPosition={setBackgroundPosition}
            setDistantBackgroundPosition={setDistantBackgroundPosition}
            setRobotY={setRobotY}
            scale={scale}
          />
        </div>
      )}

      <Iris trigger={showIris} />

      <div style={{ display: "none" }}>
        <AudioPlayer onFinish={() => {}} play={true} src="/LatinHouseBed.mp3" />
      </div>
    </div>
  );
}
