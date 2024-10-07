"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Background from "./components/Background_Final";
import Start from "./components/Start"
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound'
import { Button } from "@/components/ui/button"
import { renderToStaticMarkup } from 'react-dom/server';

export default function Home() {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);
  const [play] = useSound('/LatinHouseBed.mp3')
  const [onStart, setOnStart] = useState(true);

  function startButtonClick() {
    play();
    setOnStart(false);
  }

  return (
    // <h1 className="flex-1 min-h-screen w-screen bg-no-repeat"  style={{
    //     backgroundImage: `url("data:image/svg+xml,${svgString}")`
    //   }}>
    <div className="h-screen w-screen">
      <Background />
      <AudioPlayer onFinish={() => setPlaySubmitSound(false)} play={true} src="/LatinHouseBed.mp3" />
      {/* <div className="flex-1 size-full">
        <button className="flex-1 size-full" onClick={startButtonClick}>
          <Start />
        </button>
      </div> */}
     {/* </h1> */}
        </div>
  );
}
