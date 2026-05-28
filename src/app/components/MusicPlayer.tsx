// Persistent looping background music. Mounted at the layout level so playback
// survives client-side route changes — the audio element only exists once.
"use client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMusicPlaying = useSelector((state: RootState) => state.app.isMusicPlaying);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMusicPlaying) {
      if (audio.paused) {
        audio.play().catch(() => {
          // Autoplay blocked — playback will resume on next user gesture.
        });
      }
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [isMusicPlaying]);

  return (
    <audio
      ref={audioRef}
      src="/LatinHouseBed.mp3"
      loop
      preload="auto"
      style={{ display: "none" }}
    />
  );
};

export default MusicPlayer;
