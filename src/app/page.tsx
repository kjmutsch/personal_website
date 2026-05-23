// Home route: picks the desktop game or the static mobile landing based on viewport width.
"use client";
import dynamic from "next/dynamic";
import { useIsMobile } from "./hooks/useIsMobile";

const MobileHome = dynamic(() => import("./components/MobileHome"), {
  ssr: false,
});
const GameHome = dynamic(() => import("./GameHome"), { ssr: false });

export default function Home() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHome /> : <GameHome />;
}
