// Client-side file-explorer UI for the projects page: folder grid + repo detail modal.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import NavMenu from "../components/NavMenu";
import { triggerIris, endIris } from "@/redux/appSlice";

export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const kiaraStyle = { fontFamily: "var(--font-kiara)" };

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

interface ProjectsExplorerProps {
  repos: Repo[];
}

const ProjectsExplorer = ({ repos }: ProjectsExplorerProps) => {
  const [selected, setSelected] = useState<Repo | null>(null);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const handleBackToGame = async () => {
    if (navigating) return;
    setNavigating(true);
    dispatch(triggerIris());
    await delay(1800);
    router.push("/");
    await delay(2200);
    dispatch(endIris());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#a8d8f0] via-[#7eb3cf] to-[#2a485c] text-[#2a485c] overflow-auto relative">
      <button
        type="button"
        onClick={handleBackToGame}
        disabled={navigating}
        className="fixed top-4 left-6 text-2xl text-white hover:opacity-80 transition-opacity disabled:cursor-default"
        style={{
          ...kiaraStyle,
          zIndex: 50,
          background: "transparent",
          border: 0,
          padding: 0,
          font: "inherit",
          textShadow:
            "0 2px 4px rgba(42,72,92,0.7), 0 0 8px rgba(42,72,92,0.5)",
        }}
      >
        &larr; Back to game
      </button>
      <NavMenu />

      <main className="relative max-w-5xl mx-auto px-4 md:px-10 pt-24 pb-16">
        <div className="rounded-lg overflow-hidden border-2 border-[#2a485c] bg-[#fffaf0]/95 shadow-[6px_6px_0_0_rgba(42,72,92,0.6)]">
          {/* Window title bar */}
          <div
            className="flex items-center gap-3 px-4 py-2 border-b-2 border-[#2a485c]"
            style={{ backgroundColor: "#5a8eaa" }}
          >
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff6b6b] border border-[#2a485c]" />
              <span className="w-3 h-3 rounded-full bg-[#fad37b] border border-[#2a485c]" />
              <span className="w-3 h-3 rounded-full bg-[#7ed3a1] border border-[#2a485c]" />
            </div>
            <p
              className="ml-2 text-white text-lg leading-none"
              style={kiaraStyle}
            >
              Projects — kjmutsch/
            </p>
          </div>

          {/* Address bar */}
          <div
            className="px-4 py-2 text-sm border-b-2 border-[#2a485c] flex items-center gap-2"
            style={{ backgroundColor: "#fad37b" }}
          >
            <span className="text-[#2a485c]">&#x1F4C2;</span>
            <span className="font-mono text-[#2a485c]">
              ~/github.com/kjmutsch/
            </span>
          </div>

          {/* Folder grid */}
          <div className="p-6">
            {repos.length === 0 ? (
              <p className="text-center text-[#5a8eaa] italic py-12">
                Couldn&apos;t reach GitHub right now. Try again in a bit.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {repos.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => setSelected(repo)}
                    className="group flex flex-col items-center gap-2 p-3 rounded-md hover:bg-[#a8d8f0]/60 focus:bg-[#a8d8f0]/80 focus:outline-none transition-colors"
                  >
                    <img
                      src="/images/objects/folder_icon.png"
                      alt=""
                      className="w-20 h-20 group-hover:scale-110 transition-transform"
                      draggable={false}
                    />
                    <span
                      className="text-sm text-center text-[#2a485c] break-words leading-tight"
                      style={kiaraStyle}
                    >
                      {repo.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status bar */}
          <div
            className="px-4 py-1 border-t-2 border-[#2a485c] text-xs text-[#2a485c]"
            style={{ backgroundColor: "#a8d8f0" }}
          >
            {repos.length} item{repos.length === 1 ? "" : "s"}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="repo-modal-title"
              className="relative w-full max-w-lg rounded-lg overflow-hidden border-2 border-[#2a485c] bg-[#fffaf0] shadow-[6px_6px_0_0_rgba(42,72,92,0.6)]"
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 8, opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <header
                className="flex items-center justify-between px-4 py-2 border-b-2 border-[#2a485c]"
                style={{ backgroundColor: "#5a8eaa" }}
              >
                <p
                  id="repo-modal-title"
                  className="text-white text-xl leading-none"
                  style={kiaraStyle}
                >
                  {selected.name}
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="w-6 h-6 rounded-full bg-[#ff6b6b] border border-[#2a485c] text-[#2a485c] text-xs leading-none hover:opacity-80"
                >
                  &times;
                </button>
              </header>
              <div className="p-5 space-y-4 text-[#2a485c]">
                <p className="text-sm leading-relaxed">
                  {selected.description ?? (
                    <span className="italic text-[#5a8eaa]">
                      No description provided.
                    </span>
                  )}
                </p>

                <dl className="grid grid-cols-3 gap-x-3 gap-y-1 text-xs">
                  {selected.language && (
                    <>
                      <dt className="font-bold">Language</dt>
                      <dd className="col-span-2">{selected.language}</dd>
                    </>
                  )}
                  <dt className="font-bold">Updated</dt>
                  <dd className="col-span-2">
                    {formatDate(selected.updated_at)}
                  </dd>
                  {selected.stargazers_count > 0 && (
                    <>
                      <dt className="font-bold">Stars</dt>
                      <dd className="col-span-2">
                        {selected.stargazers_count}
                      </dd>
                    </>
                  )}
                </dl>

                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={selected.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded bg-[#fad37b] text-[#2a485c] border-2 border-[#2a485c] shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm"
                    style={kiaraStyle}
                  >
                    View on GitHub
                  </a>
                  {selected.homepage && (
                    <a
                      href={selected.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded bg-[#a8d8f0] text-[#2a485c] border-2 border-[#2a485c] shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm"
                      style={kiaraStyle}
                    >
                      Live site
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsExplorer;
