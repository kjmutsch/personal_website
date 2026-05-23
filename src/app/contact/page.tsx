// Contact page reached via the envelope page-icon or the top-right quick-nav.
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import NavMenu from "../components/NavMenu";
import SpriteAnimation from "../components/CatSpriteSheet";
import { triggerIris, endIris } from "@/redux/appSlice";
import { useIsMobile } from "../hooks/useIsMobile";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LINKS: { label: string; value: string; href: string }[] = [
  { label: "Email", value: "kjmutsch@gmail.com", href: "mailto:kjmutsch@gmail.com" },
  { label: "GitHub", value: "github.com/kjmutsch", href: "https://github.com/kjmutsch" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/kiara-mutschler",
    href: "https://www.linkedin.com/in/kiara-mutschler/",
  },
  {
    label: "YouTube",
    value: "@kiaramutschler",
    href: "https://www.youtube.com/channel/UCF9W2jIanZtjSDHpDp8Hosw/",
  },
];

const VIDEOS: { id: string; title: string; caption: string }[] = [
  {
    id: "ipbsA-jOAjA",
    title: "Tutoring guide video 1",
    caption:
      "Recorded while I was a tutor and peer mentor — a walkthrough I made at the request of the professor I worked under, as a guide for the class. I make similar demo videos in my current role, but can't share those publicly.",
  },
  {
    id: "aWyP_gryfQw",
    title: "Tutoring guide video 2",
    caption:
      "Another class guide from the same peer-mentor role. Same idea, different topic.",
  },
];

export default function Contact() {
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const handleBackToGame = async () => {
    if (navigating) return;
    setNavigating(true);
    if (isMobile) {
      router.push("/");
      return;
    }
    dispatch(triggerIris());
    await delay(1800);
    router.push("/");
    await delay(2200);
    dispatch(endIris());
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-b from-[#a8d8f0] via-[#7eb3cf] to-[#2a485c] text-[#2a485c] relative">
      <button
        type="button"
        onClick={handleBackToGame}
        disabled={navigating}
        className="font-kiara fixed top-4 left-6 text-2xl text-white hover:opacity-80 transition-opacity disabled:cursor-default"
        style={{
          zIndex: 50,
          background: "transparent",
          border: 0,
          padding: 0,
          font: "inherit",
          textShadow:
            "-1px -1px 0 rgba(42,72,92,0.95), 1px -1px 0 rgba(42,72,92,0.95), -1px 1px 0 rgba(42,72,92,0.95), 1px 1px 0 rgba(42,72,92,0.95), 0 2px 4px rgba(42,72,92,0.85), 0 0 10px rgba(42,72,92,0.55)",
        }}
      >
        &larr; {isMobile ? "Home" : "Back to game"}
      </button>
      <NavMenu />

      <main className="relative max-w-4xl mx-auto px-4 md:px-10 pt-24 pb-16 space-y-8">
        <motion.section
          className="relative rounded-lg overflow-visible border-2 border-[#2a485c] bg-[#fffaf0]/95 shadow-[6px_6px_0_0_rgba(42,72,92,0.6)]"
          initial={isMobile ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {!isMobile && (
            <div
              className="absolute right-4 md:right-6 pointer-events-none select-none"
              style={{ bottom: "calc(100% - 24px)" }}
              aria-hidden="true"
            >
              <SpriteAnimation displaySize={96} />
            </div>
          )}

          <header
            className="flex items-center gap-3 px-5 py-3 border-b-2 border-[#2a485c] rounded-t-md"
            style={{ backgroundColor: "#fad37b" }}
          >
            <img
              src="/images/objects/envelope_icon.svg"
              alt=""
              className="w-10 h-10"
              draggable={false}
            />
            <h1 className="font-kiara text-3xl tracking-wide text-[#2a485c]">
              Contact Me
            </h1>
          </header>

          <div className="p-6 md:p-8 space-y-6">
            <p className="text-sm md:text-base leading-relaxed text-[#2a485c]">
              Reach out about engineering work, AI projects, or just to say hi.
              I&apos;m most responsive over email and LinkedIn.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border-2 border-[#2a485c] bg-[#a8d8f0]/60 hover:bg-[#a8d8f0] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shadow-[3px_3px_0_0_rgba(42,72,92,0.6)] transition-all"
                  >
                    <span className="font-kiara text-lg text-[#2a485c]">
                      {link.label}
                    </span>
                    <span className="text-xs md:text-sm text-[#2a485c] truncate">
                      {link.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <motion.section
          className="rounded-lg overflow-hidden border-2 border-[#2a485c] bg-[#fffaf0]/95 shadow-[6px_6px_0_0_rgba(42,72,92,0.6)]"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          <header
            className="px-5 py-2 border-b-2 border-[#2a485c]"
            style={{ backgroundColor: "#5a8eaa" }}
          >
            <h2 className="font-kiara text-2xl tracking-wide text-white">
              Demo Videos
            </h2>
          </header>
          <div className="p-5 md:p-6 grid md:grid-cols-2 gap-5">
            {VIDEOS.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="relative w-full overflow-hidden rounded-md border-2 border-[#2a485c] shadow-[3px_3px_0_0_rgba(42,72,92,0.6)] bg-black aspect-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <p className="text-sm italic text-[#5a8eaa]">{video.caption}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <section className="pt-4 pb-2 hidden md:flex justify-center">
          <button
            type="button"
            onClick={handleBackToGame}
            disabled={navigating}
            className="font-kiara px-8 py-4 rounded-full bg-[#fad37b] text-[#2a485c] text-2xl border-2 border-[#2a485c] shadow-[4px_4px_0_0_rgba(42,72,92,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] transition-all disabled:opacity-70 disabled:cursor-default"
          >
            Continue Game
          </button>
        </section>
      </main>
    </div>
  );
}
