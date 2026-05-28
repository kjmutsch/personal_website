// Small mute/unmute control for the persistent background music.
"use client";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/redux/store";
import { setMusicPlaying } from "@/redux/appSlice";

const MusicToggle = () => {
  const dispatch = useAppDispatch();
  const isMusicPlaying = useSelector(
    (s: RootState) => s.app.isMusicPlaying
  );

  return (
    <button
      type="button"
      aria-label={isMusicPlaying ? "Mute music" : "Play music"}
      onClick={() => dispatch(setMusicPlaying(!isMusicPlaying))}
      tabIndex={-1}
      className="outline-none focus:outline-none opacity-60 hover:opacity-100 transition-opacity"
      style={{
        background: "transparent",
        border: 0,
        padding: 0,
        color: "inherit",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Music note */}
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        {/* Slash when muted */}
        {!isMusicPlaying && <line x1="3" y1="3" x2="21" y2="21" />}
      </svg>
    </button>
  );
};

export default MusicToggle;
