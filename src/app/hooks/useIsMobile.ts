// Viewport-width hook. True at <768px to match Tailwind's `md:` breakpoint.
"use client";
import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
};
