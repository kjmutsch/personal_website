// Top-right quick-nav: text links on desktop, hamburger overlay on mobile.
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "../hooks/useIsMobile";
import MusicToggle from "./MusicToggle";

interface NavMenuProps {
  onResume?: () => void;
  onProjects?: () => void;
  onContact?: () => void;
}

const NavMenu = ({ onResume, onProjects, onContact }: NavMenuProps) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Close the overlay if the viewport crosses back to desktop.
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Prevent the page underneath from scrolling while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isResumeActive = pathname === "/resume";
  const isProjectsActive = pathname === "/projects";
  const isContactActive = pathname === "/contact";

  const baseItem = "outline-none focus:outline-none transition-opacity";
  const activeLink = (active: boolean) =>
    `${baseItem} cursor-pointer opacity-90 hover:opacity-100 ${
      active ? "underline underline-offset-4 opacity-100" : ""
    }`;
  const buttonReset = {
    background: "transparent",
    border: 0,
    padding: 0,
    font: "inherit",
    color: "inherit",
    textShadow: "inherit",
  } as const;

  const textShadow =
    "-1px -1px 0 rgba(42,72,92,0.95), 1px -1px 0 rgba(42,72,92,0.95), -1px 1px 0 rgba(42,72,92,0.95), 1px 1px 0 rgba(42,72,92,0.95), 0 2px 4px rgba(42,72,92,0.85), 0 0 10px rgba(42,72,92,0.55)";

  if (isMobile) {
    return (
      <>
        <div
          className="fixed text-white"
          style={{ zIndex: 110, top: "4.25rem", right: "1.5rem" }}
        >
          <MusicToggle />
        </div>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="fixed top-4 right-5 flex flex-col justify-center items-center gap-[5px] w-11 h-11 rounded-md select-none"
          style={{ zIndex: 110, background: "transparent", border: 0 }}
        >
          <span
            className="block w-7 h-[3px] rounded-full bg-white transition-transform"
            style={{
              boxShadow: "0 1px 2px rgba(42,72,92,0.7)",
              transform: open ? "translateY(8px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-7 h-[3px] rounded-full bg-white transition-opacity"
            style={{
              boxShadow: "0 1px 2px rgba(42,72,92,0.7)",
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-7 h-[3px] rounded-full bg-white transition-transform"
            style={{
              boxShadow: "0 1px 2px rgba(42,72,92,0.7)",
              transform: open ? "translateY(-8px) rotate(-45deg)" : "none",
            }}
          />
        </button>

        {open && (
          <div
            className="fixed inset-0 flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-[#a8d8f0] via-[#7eb3cf] to-[#2a485c]"
            style={{ zIndex: 105 }}
            onClick={() => setOpen(false)}
          >
            <Link
              href="/resume"
              tabIndex={-1}
              className={`font-kiara text-5xl text-white ${
                isResumeActive ? "underline underline-offset-8" : ""
              }`}
              style={{ textShadow }}
            >
              Resume
            </Link>
            <Link
              href="/projects"
              tabIndex={-1}
              className={`font-kiara text-5xl text-white ${
                isProjectsActive ? "underline underline-offset-8" : ""
              }`}
              style={{ textShadow }}
            >
              Projects
            </Link>
            <Link
              href="/contact"
              tabIndex={-1}
              className={`font-kiara text-5xl text-white ${
                isContactActive ? "underline underline-offset-8" : ""
              }`}
              style={{ textShadow }}
            >
              Contact
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <nav
        className="font-kiara fixed top-4 right-6 flex items-center gap-6 text-white text-2xl select-none"
        style={{ zIndex: 100, textShadow }}
      >
        {onResume && !isResumeActive ? (
        <button
          type="button"
          onClick={onResume}
          tabIndex={-1}
          className={activeLink(isResumeActive)}
          style={buttonReset}
        >
          Resume
        </button>
      ) : (
        <Link href="/resume" tabIndex={-1} className={activeLink(isResumeActive)}>
          Resume
        </Link>
      )}
      {onProjects && !isProjectsActive ? (
        <button
          type="button"
          onClick={onProjects}
          tabIndex={-1}
          className={activeLink(isProjectsActive)}
          style={buttonReset}
        >
          Projects
        </button>
      ) : (
        <Link
          href="/projects"
          tabIndex={-1}
          className={activeLink(isProjectsActive)}
        >
          Projects
        </Link>
      )}
      {onContact && !isContactActive ? (
        <button
          type="button"
          onClick={onContact}
          tabIndex={-1}
          className={activeLink(isContactActive)}
          style={buttonReset}
        >
          Contact
        </button>
      ) : (
        <Link
          href="/contact"
          tabIndex={-1}
          className={activeLink(isContactActive)}
        >
          Contact
        </Link>
      )}
      </nav>
      <div
        className="fixed text-white"
        style={{ zIndex: 100, top: "3.25rem", right: "1.5rem" }}
      >
        <MusicToggle />
      </div>
    </>
  );
};

export default NavMenu;
