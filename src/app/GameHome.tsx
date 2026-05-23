// Desktop home: hosts the side-scrolling game, spawns coins/page icons, and drives transitions.
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import useSound from "use-sound";
import Start from "./components/Start";
import AudioPlayer from "./components/AudioPlayer";
import Robot from "./components/Robot";
import TextBubble from "./components/TextBubble";
import BackgroundWrapper from "./components/BackgroundWrapper";
import Coin from "./components/Coin";
import PageIcon from "./components/PageIcon";
import Flag from "./components/Flag";
import NavMenu from "./components/NavMenu";
import CoinCounter from "./components/CoinCounter";
import { RootState } from "@/redux/store";
import { triggerIris, endIris } from "@/redux/appSlice";
import { clearGameSession, loadGameSession, saveGameSession } from "./lib/gameSession";

const PAGES: { id: string; route: string; x: number; yOffset: number; icon?: string }[] = [
  // yOffset is added to the robot's screen-space Y so the icon always sits in the robot's path.
  { id: "resume", route: "/resume", x: 2200, yOffset: 20 },
  { id: "projects", route: "/projects", x: 3000, yOffset: 20, icon: "/images/objects/folder_icon.png" },
  { id: "contact", route: "/contact", x: 3800, yOffset: 20, icon: "/images/objects/envelope_icon.svg" },
];

const FLAG_X = 4800;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Module-level: stays true across client-side route changes (same JS context)
// but resets on a real document load (refresh, direct visit), so refreshes
// don't resume from a stale sessionStorage snapshot.
let hasMountedInDocument = false;

export default function GameHome() {
  const [play] = useSound("/LatinHouseBed.mp3");
  const [initialSession] = useState(() => {
    if (typeof window === "undefined") return null;
    if (!hasMountedInDocument) {
      hasMountedInDocument = true;
      clearGameSession();
      return null;
    }
    return loadGameSession();
  });
  const resuming = initialSession !== null;

  const [onStart, setOnStart] = useState(!resuming);
  const [showBackground, setShowBackground] = useState(resuming);
  const [backgroundPosition, setBackgroundPosition] = useState(initialSession?.backgroundPosition ?? 0);
  const [distantBackgroundPosition, setDistantBackgroundPosition] = useState(initialSession?.distantBackgroundPosition ?? 0);
  const [ready, setReady] = useState(resuming);
  const [robotY, setRobotY] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (resuming) clearGameSession();
  }, [resuming]);

  const dispatch = useDispatch();
  const router = useRouter();
  const isMovingBackwards = useSelector((state: RootState) => state.app.isMovingBackwards);
  const isMovingForwards = useSelector((state: RootState) => state.app.isMovingForwards);

  // Calculate scale factor based on viewport height
  const SVG_BASE_HEIGHT = 771;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
  const scale = screenHeight / SVG_BASE_HEIGHT;

  const handleStart = async () => {
    play();
    dispatch(triggerIris());

    await delay(1800);
    setShowBackground(true);
    setOnStart(false);

    await delay(2200);
    dispatch(endIris());

    await delay(1800);
    setReady(true);
  };

  // Coin pattern
  const coinRate = 500;
  const coinYOffset = [50, -20, -10];
  const [coins, setCoins] = useState<{ x: number; y: number; id: number }[]>(
    initialSession?.coins ?? []
  );
  const [coinsCollected, setCoinsCollected] = useState(
    initialSession?.coinsCollected ?? 0
  );
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1920;

  const lastGeneratedSegment = useRef(
    initialSession?.lastGeneratedSegment ?? Math.floor(-backgroundPosition / coinRate)
  );
  const lastCoinIndex = useRef(initialSession?.lastCoinIndex ?? 0);
  const enteredRoutesRef = useRef<string[]>(initialSession?.enteredRoutes ?? []);

  useEffect(() => {
    const currentSegment = Math.floor(backgroundPosition / -coinRate);

    if (!isMovingBackwards && currentSegment > lastGeneratedSegment.current) {
      lastGeneratedSegment.current = currentSegment;

      const nextHeightIndex = lastCoinIndex.current % coinYOffset.length;
      lastCoinIndex.current++;

      setCoins((prevCoins) => {
        const filteredCoins = prevCoins.filter((coin) => coin.x > -backgroundPosition - screenWidth * 1.5);

        const newCoin = {
          x: -backgroundPosition + screenWidth,
          y: robotY + coinYOffset[nextHeightIndex],
          id: currentSegment,
        };

        return [...filteredCoins, newCoin];
      });
    }
  }, [backgroundPosition, isMovingBackwards, robotY]);

  const handleCollectCoin = (coinId: number) => {
    setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== coinId));
    setCoinsCollected((n) => n + 1);
  };

  const handleEnterPage = async (route: string) => {
    const nextEnteredRoutes = enteredRoutesRef.current.includes(route)
      ? enteredRoutesRef.current
      : [...enteredRoutesRef.current, route];
    enteredRoutesRef.current = nextEnteredRoutes;
    saveGameSession({
      backgroundPosition,
      distantBackgroundPosition,
      coins,
      coinsCollected,
      lastGeneratedSegment: lastGeneratedSegment.current,
      lastCoinIndex: lastCoinIndex.current,
      enteredRoutes: nextEnteredRoutes,
    });
    dispatch(triggerIris());
    await delay(1800);
    router.push(route);
    await delay(2200);
    dispatch(endIris());
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BackgroundWrapper
        position={backgroundPosition}
        distantPosition={distantBackgroundPosition}
        startActive={onStart}
        isMovingBackwards={isMovingBackwards}
        isMovingForwards={isMovingForwards}
      />

      {/* Coins */}
      {coins
        .filter((coin) => coin.x + backgroundPosition > -100 && coin.x + backgroundPosition < screenWidth + 100)
        .map((coin) => (
          <Coin
            key={coin.id}
            id={coin.id}
            backgroundPosition={backgroundPosition}
            x={coin.x}
            y={coin.y}
            robotY={robotY}
            onCollect={() => handleCollectCoin(coin.id)}
          />
        ))}

      {/* Finish flag — only worth rendering when it's near the viewport */}
      {FLAG_X + backgroundPosition > -200 && FLAG_X + backgroundPosition < screenWidth + 200 && (
        <Flag
          x={FLAG_X}
          backgroundPosition={backgroundPosition}
          robotY={robotY}
          gameEnded={gameEnded}
          onReach={() => setGameEnded(true)}
        />
      )}

      {/* Page icons — hide routes already visited this session */}
      {PAGES
        .filter((page) => !enteredRoutesRef.current.includes(page.route))
        .filter((page) => page.x + backgroundPosition > -100 && page.x + backgroundPosition < screenWidth + 100)
        .map((page) => (
          <PageIcon
            key={page.id}
            id={page.id}
            route={page.route}
            x={page.x}
            y={robotY + page.yOffset}
            backgroundPosition={backgroundPosition}
            robotY={robotY}
            onEnter={handleEnterPage}
            icon={page.icon}
          />
        ))}

      {!onStart && (
        <NavMenu
          onResume={() => handleEnterPage("/resume")}
          onProjects={() => handleEnterPage("/projects")}
          onContact={() => handleEnterPage("/contact")}
        />
      )}
      {!onStart && <CoinCounter count={coinsCollected} />}

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
          <TextBubble ready={ready} scale={scale} resuming={resuming} />
          <Robot
            ready={ready}
            setBackgroundPosition={setBackgroundPosition}
            setDistantBackgroundPosition={setDistantBackgroundPosition}
            setRobotY={setRobotY}
            scale={scale}
            resuming={resuming}
            initialBackgroundPosition={initialSession?.backgroundPosition ?? 0}
            initialDistantBackgroundPosition={initialSession?.distantBackgroundPosition ?? 0}
            gameEnded={gameEnded}
          />
        </div>
      )}

      {gameEnded && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10000 }}
        >
          <img
            src="/images/TheEnd.png"
            alt="The End"
            style={{
              width: "min(600px, 60vw)",
              height: "auto",
              imageRendering: "pixelated",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))",
            }}
            draggable={false}
          />
        </div>
      )}

      <div style={{ display: "none" }}>
        <AudioPlayer onFinish={() => {}} play={true} src="/LatinHouseBed.mp3" />
      </div>
    </div>
  );
}
