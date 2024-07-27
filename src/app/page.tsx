"use client"; // This is a client component 👈🏽
import { useState } from "react";
import Background from "./components/Background";
import Start from "./components/Start"
import AudioPlayer from "./components/AudioPlayer";
import useSound from 'use-sound'

export default function Home() {
  const [playSubmitSound, setPlaySubmitSound] = useState(false);
  const [play] = useSound('/LatinHouseBed.mp3')
  return (
    <>
      <AudioPlayer onFinish={() => setPlaySubmitSound(false)} play={true} src="/LatinHouseBed.mp3" />
        <Start />
        <Background />
        <button 
          onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => play()}
      >sound</button>
    </>

  );
}
