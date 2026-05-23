// Mobile landing page: static intro and tap-friendly nav. No game, no rAF loops.
"use client";
import Image from "next/image";
import Link from "next/link";
import NavMenu from "./NavMenu";

const NAV_ITEMS: { label: string; href: string; icon: string; tint: string }[] = [
  {
    label: "Resume",
    href: "/resume",
    icon: "/images/objects/page_icon.png",
    tint: "#fad37b",
  },
  {
    label: "Projects",
    href: "/projects",
    icon: "/images/objects/folder_icon.png",
    tint: "#a8d8f0",
  },
  {
    label: "Contact",
    href: "/contact",
    icon: "/images/objects/envelope_icon.svg",
    tint: "#fad37b",
  },
];

const MobileHome = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#a8d8f0] via-[#7eb3cf] to-[#2a485c] text-[#2a485c]">
      <NavMenu />

      <main className="relative z-10 px-6 pt-20 pb-12 flex flex-col items-center text-center">
        <h1 className="font-kiara text-5xl text-white drop-shadow-[0_2px_4px_rgba(42,72,92,0.7)]">
          Hi, I&apos;m Kiara
        </h1>
        <p className="mt-2 italic text-sm text-white/90 drop-shadow-[0_1px_2px_rgba(42,72,92,0.7)]">
          crafting, designing, and building
        </p>

        <div className="relative mt-8 w-full max-w-sm flex justify-center">
          <div className="relative" style={{ width: 140, height: 140 }}>
            <Image
              src="/images/robot/full_robot.png"
              alt="Robot character"
              fill
              priority
              sizes="140px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <p className="font-kiara mt-10 text-2xl text-white drop-shadow-[0_2px_4px_rgba(42,72,92,0.7)]">
          Where to next?
        </p>

        <nav className="mt-6 w-full max-w-sm flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 rounded-lg border-2 border-[#2a485c] bg-[#fffaf0]/95 shadow-[4px_4px_0_0_rgba(42,72,92,0.6)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] transition-all"
            >
              <span
                className="flex items-center justify-center w-14 h-14 rounded-md border-2 border-[#2a485c] shrink-0"
                style={{ backgroundColor: item.tint }}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, objectFit: "contain" }}
                />
              </span>
              <span className="font-kiara text-2xl text-[#2a485c] text-left flex-1">
                {item.label}
              </span>
              <span className="font-kiara text-2xl text-[#5a8eaa]">&rarr;</span>
            </Link>
          ))}
        </nav>

        <p className="mt-10 text-xs italic text-white/80 px-4 leading-relaxed drop-shadow-[0_1px_2px_rgba(42,72,92,0.6)]">
          Psst &mdash; on desktop, this site is a little robot side-scroller.
          Open it on a laptop sometime to play.
        </p>
      </main>
    </div>
  );
};

export default MobileHome;
