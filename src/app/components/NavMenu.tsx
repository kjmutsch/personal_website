// Top-right quick-nav rendered in the Kiara font; live link to Resume plus placeholder items.
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PLACEHOLDERS = ["About", "Contact"];

interface NavMenuProps {
  onResume?: () => void;
  onProjects?: () => void;
}

const NavMenu = ({ onResume, onProjects }: NavMenuProps) => {
  const pathname = usePathname();
  const isResumeActive = pathname === "/resume";
  const isProjectsActive = pathname === "/projects";

  const baseItem = "outline-none focus:outline-none transition-opacity";
  const activeLink = (active: boolean) =>
    `${baseItem} cursor-pointer opacity-90 hover:opacity-100 ${
      active ? "underline underline-offset-4 opacity-100" : ""
    }`;
  const placeholderClass = `${baseItem} opacity-90 italic cursor-not-allowed`;
  const buttonReset = {
    background: "transparent",
    border: 0,
    padding: 0,
    font: "inherit",
    color: "inherit",
    textShadow: "inherit",
  };

  return (
    <nav
      className="fixed top-4 right-6 flex items-center gap-6 text-white text-2xl select-none"
      style={{
        fontFamily: "var(--font-kiara)",
        zIndex: 100,
        textShadow:
          "0 2px 4px rgba(42,72,92,0.7), 0 0 8px rgba(42,72,92,0.5)",
      }}
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
      {PLACEHOLDERS.map((label) => (
        <span key={label} className={placeholderClass} aria-disabled="true">
          {label}
        </span>
      ))}
    </nav>
  );
};

export default NavMenu;
