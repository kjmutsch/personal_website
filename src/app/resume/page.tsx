// Resume page reached via the in-world page icon or the top-right quick-nav.
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import NavMenu from "../components/NavMenu";
import { triggerIris, endIris } from "@/redux/appSlice";
import { useIsMobile } from "../hooks/useIsMobile";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type DoodlePlacement = {
  name: string;
  top: string;
  left: string;
  size: number;
  rotate: number;
};

// Hardcoded so positions stay stable between renders (no SSR hydration mismatch)
// and so the scatter stays visually balanced rather than truly random.
const DOODLES: DoodlePlacement[] = [
  { name: "heart", top: "5%", left: "6%", size: 110, rotate: -8 },
  { name: "music", top: "2%", left: "38%", size: 80, rotate: 12 },
  { name: "star", top: "4%", left: "74%", size: 75, rotate: 18 },
  { name: "flower", top: "9%", left: "92%", size: 95, rotate: -14 },
  { name: "sun", top: "12%", left: "24%", size: 90, rotate: -4 },
  { name: "planet", top: "13%", left: "58%", size: 85, rotate: 14 },
  { name: "bow", top: "17%", left: "4%", size: 95, rotate: -6 },
  { name: "cat", top: "21%", left: "82%", size: 110, rotate: -12 },
  { name: "moon", top: "20%", left: "43%", size: 80, rotate: -10 },
  { name: "strawberry", top: "30%", left: "12%", size: 75, rotate: 9 },
  { name: "bolt", top: "34%", left: "76%", size: 70, rotate: -16 },
  { name: "mountain", top: "43%", left: "91%", size: 110, rotate: 6 },
  { name: "cloud", top: "40%", left: "3%", size: 130, rotate: 11 },
  { name: "moon", top: "44%", left: "25%", size: 130, rotate: 11 },
  { name: "catface", top: "44%", left: "52%", size: 95, rotate: 8 },
  { name: "s", top: "47%", left: "30%", size: 70, rotate: -4 },
  { name: "worm", top: "52%", left: "78%", size: 90, rotate: -9 },
  { name: "heart", top: "57%", left: "6%", size: 85, rotate: 12 },
  { name: "flower", top: "60%", left: "94%", size: 80, rotate: 17 },
  { name: "music", top: "64%", left: "40%", size: 90, rotate: -7 },
  { name: "star", top: "68%", left: "62%", size: 70, rotate: -18 },
  { name: "planet", top: "72%", left: "16%", size: 85, rotate: 5 },
  { name: "sun", top: "75%", left: "88%", size: 95, rotate: -8 },
  { name: "bolt", top: "80%", left: "50%", size: 75, rotate: 14 },
  { name: "strawberry", top: "83%", left: "26%", size: 70, rotate: -11 },
  { name: "catface", top: "86%", left: "73%", size: 90, rotate: -5 },
  { name: "moon", top: "90%", left: "8%", size: 80, rotate: 9 },
  { name: "bow", top: "92%", left: "92%", size: 85, rotate: -13 },
  { name: "cat", top: "96%", left: "44%", size: 100, rotate: 6 },
];

const SKILLS: { category: string; items: string[] }[] = [
  {
    category: "Frontend",
    items: [
      "React",
      "React Native",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind",
      "Material-UI",
      "Node",
    ],
  },
  {
    category: "Backend & Data",
    items: ["Python", "Java", "SQL", "Snowflake", "Teradata"],
  },
  {
    category: "Cloud & AI",
    items: ["AWS (Bedrock, AgentCore, Quick Suite)", "Microsoft Azure"],
  },
  {
    category: "DevOps & Tools",
    items: ["GitHub", "GitHub Actions", "Docker", "Power BI", "Jira"],
  },
  {
    category: "Design",
    items: ["Figma", "InVision", "Adobe Photoshop"],
  },
];

const EXPERIENCE = [
  {
    title: "AI Engineer (Lead Frontend)",
    company: "3M",
    years: "Sep 2025 – Present",
    bullets: [
      "Lead the AI Experiences team, owning frontend architecture and delivery across multiple applications, including Navigator, an enterprise AI chat platform with RAG and multimodal capabilities — 23,806 unique users and 4,379,859 queries in 2026.",
      "Manage technical direction, task delegation, and code reviews for a team of four frontend engineers and designers; facilitate Agile Scrum ceremonies and serve as the primary liaison between frontend, backend/ML, and business stakeholders.",
      "Architected a scalable React + TypeScript frontend using Redux Toolkit with real-time AI response streaming over HTTP (REST) and WebSockets.",
      "Implemented and designed reusable UI components, dynamic theming, file uploads, voice and translation modes, and reasoning visualizations.",
      "Integrated frontend with AWS and Azure-hosted AI services.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company: "3M",
    years: "May 2024 – Sep 2025",
    bullets: [
      "Full-stack engineer delivering web and mobile applications for executive KPI tracking.",
      "Led React Native mobile app development and frontend UX optimization.",
      "Built backend APIs and data pipelines using Python, Java, SQL, Azure, and AWS.",
      "Contributed to CI/CD pipelines using Docker and GitHub Actions.",
    ],
  },
  {
    title: "Software Engineer",
    company: "3M",
    years: "Jan 2021 – May 2024",
    bullets: [
      "Developed React applications supporting supply chain analytics and reporting.",
      "Built dashboards and data visualizations using Power BI and SQL.",
      "Delivered business intelligence dashboards using Snowflake, Teradata, SQL, and Power BI.",
    ],
  },
];

const LEADERSHIP = [
  "Led the IT NERD board as Chair (17 members across 3 committees) supporting onboarding and career development for 300+ IT community members.",
  "Organized 12+ internal events annually and managed monthly newsletters and leadership meetings.",
  "Designed and ran a Reverse Mentorship Program pairing 40 employees, including SVPs and Directors.",
];

const PROJECTS = [
  "Designed and built this responsive personal website using React, Next.js, and React Native, showcasing projects and technical writing.",
  "Created custom visuals and UI assets in Adobe Photoshop, focusing on layout, branding, and visual consistency — including the doodles bordering this page.",
  "Built core computer science and machine learning concepts from scratch (decision trees, linked lists, etc.) to develop a deep understanding of underlying algorithms and data structures.",
];

const DoodleScatter = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block"
  >
    {DOODLES.map((d, i) => (
      <Image
        key={`${d.name}-${i}`}
        src={`/images/doodles/doodles_${d.name}.svg`}
        alt=""
        width={d.size}
        height={d.size}
        className="absolute opacity-80"
        style={{
          top: d.top,
          left: d.left,
          width: `${d.size}px`,
          height: "auto",
          transform: `translate(-50%, -50%) rotate(${d.rotate}deg)`,
        }}
      />
    ))}
  </div>
);

type SectionCardProps = {
  title: string;
  headerColor: "blue" | "yellow";
  children: React.ReactNode;
};

const SectionCard = ({ title, headerColor, children }: SectionCardProps) => {
  const headerBg = headerColor === "blue" ? "#5a8eaa" : "#fad37b";
  const headerText = headerColor === "blue" ? "#ffffff" : "#2a485c";
  return (
    <motion.section
      className="rounded-lg overflow-hidden border-2 border-[#2a485c] bg-[#fffaf0]/90 backdrop-blur-sm shadow-[4px_4px_0_0_rgba(42,72,92,0.6)]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Shrink the trigger zone away from the bottom of the viewport so
      // short sidebar cards (Contact, Education) don't fire their reveal
      // animation while they're still sitting near the page fold at load.
      viewport={{ once: true, amount: 0.3, margin: "0px 0px -25% 0px" }}
      transition={{ duration: 0.4 }}
    >
      <header
        className="px-4 py-2 border-b-2 border-[#2a485c]"
        style={{ backgroundColor: headerBg }}
      >
        <h2
          className="font-kiara text-2xl tracking-wide"
          style={{ color: headerText }}
        >
          {title}
        </h2>
      </header>
      <div className="p-5 text-[#2a485c]">{children}</div>
    </motion.section>
  );
};

export default function Resume() {
  const [hideArrow, setHideArrow] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.2) {
        setHideArrow(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

      <div className="relative">
        <DoodleScatter />

        <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-16 lg:px-24 pt-24 pb-12 space-y-8">
          <SectionCard title="About Me" headerColor="yellow">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0 flex flex-col items-center gap-3">
                <div className="w-40 h-40 rounded-full border-8 border-dotted border-[#fad37b] bg-[#5a8eaa] flex items-center justify-center text-7xl text-white">
                  <span className="font-kiara">K</span>
                </div>
                <div className="text-center text-sm leading-snug">
                  <p className="font-kiara text-xl">
                    Kiara Mutschler
                  </p>
                  <p>Saint Paul, MN</p>
                  <p className="italic text-[#5a8eaa]">
                    &quot;crafting, designing, and building&quot;
                  </p>
                </div>
              </div>
              <div className="flex-1 italic text-[#5a8eaa] text-sm leading-relaxed flex flex-col justify-center gap-3">
                <p>
                  I built this site to stretch my creativity and Photoshop
                  skills next to my programming ones. I made as much of it
                  as I possibly could myself: the background scenery and the
                  robot from the home page were painted in Photoshop, the
                  start button and the doodles bordering this page were drawn
                  on paper and digitized, and even the{" "}
                  <span className="font-kiara not-italic text-[#2a485c] text-base">
                    handwritten font
                  </span>{" "}
                  is my own handwriting turned into a typeface.
                </p>
                <p>
                  Outside of work you&apos;ll usually find me crafting or
                  designing something, whether that&apos;s illustrating,
                  gardening, sewing, or building little side projects like
                  this one. I try to find the beauty and the fun in
                  everything I make, whether it&apos;s for work or just for
                  me.
                </p>
              </div>
            </div>

            {!hideArrow && (
              <motion.div
                className="mt-4 text-center text-3xl text-[#5a8eaa]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                &darr;
              </motion.div>
            )}
          </SectionCard>

          <div className="grid md:grid-cols-3 gap-6">
            <aside className="space-y-6 md:col-span-1">
              <SectionCard title="Contact" headerColor="blue">
                <table className="w-full text-sm">
                  <tbody className="align-top">
                    <tr>
                      <td className="font-bold pr-2 py-1">Email</td>
                      <td className="py-1 break-all">kjmutsch@gmail.com</td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-2 py-1">Phone</td>
                      <td className="py-1">715-781-7986</td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-2 py-1">GitHub</td>
                      <td className="py-1">
                        <a
                          href="https://github.com/kjmutsch"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5a8eaa] underline hover:text-[#2a485c]"
                        >
                          kjmutsch
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-2 py-1">LinkedIn</td>
                      <td className="py-1">
                        <a
                          href="https://www.linkedin.com/in/kiara-mutschler/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5a8eaa] underline hover:text-[#2a485c]"
                        >
                          kiara-mutschler
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold pr-2 py-1">YouTube</td>
                      <td className="py-1">
                        <a
                          href="https://www.youtube.com/channel/UCF9W2jIanZtjSDHpDp8Hosw/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#5a8eaa] underline hover:text-[#2a485c]"
                        >
                          Channel
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </SectionCard>

              <SectionCard title="Education" headerColor="yellow">
                <p className="text-sm font-bold leading-snug">
                  University of Wisconsin–Madison
                </p>
                <p className="text-sm">B.S. Computer Science</p>
                <p className="text-xs text-[#5a8eaa]">Fall 2020</p>
              </SectionCard>

              <SectionCard title="Skills" headerColor="blue">
                <ul className="space-y-3 text-sm">
                  {SKILLS.map((group) => (
                    <li key={group.category}>
                      <p className="font-bold mb-1">{group.category}</p>
                      <div className="flex flex-wrap gap-1">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-0.5 rounded bg-[#a8d8f0] text-[#2a485c] text-xs border border-[#5a8eaa]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            </aside>

            <div className="md:col-span-2 space-y-6">
              <SectionCard title="Experience" headerColor="yellow">
                <div className="space-y-5">
                  {EXPERIENCE.map((role) => (
                    <div
                      key={role.title + role.years}
                      className="border-l-4 border-[#fad37b] pl-4"
                    >
                      <p className="font-kiara text-xl leading-tight">
                        {role.title}
                      </p>
                      <p className="text-sm text-[#5a8eaa]">
                        {role.company} &middot; {role.years}
                      </p>
                      <ul className="mt-2 space-y-1 text-sm list-disc list-outside ml-5">
                        {role.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title="Leadership & Organizational Impact"
                headerColor="blue"
              >
                <ul className="space-y-2 text-sm list-disc list-outside ml-5">
                  {LEADERSHIP.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </SectionCard>

              <SectionCard title="Personal Projects" headerColor="yellow">
                <ul className="space-y-2 text-sm list-disc list-outside ml-5">
                  {PROJECTS.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </SectionCard>
            </div>
          </div>

          <section className="pt-8 pb-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/Kiara_Mutschler_Resume.pdf"
              download
              className="font-kiara px-8 py-4 rounded-full bg-[#5a8eaa] text-white text-2xl border-2 border-[#2a485c] shadow-[4px_4px_0_0_rgba(42,72,92,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] transition-all"
            >
              Download Resume
            </a>
            <button
              type="button"
              onClick={handleBackToGame}
              disabled={navigating}
              className="font-kiara px-8 py-4 rounded-full bg-[#fad37b] text-[#2a485c] text-2xl border-2 border-[#2a485c] shadow-[4px_4px_0_0_rgba(42,72,92,0.6)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(42,72,92,0.6)] transition-all disabled:opacity-70 disabled:cursor-default hidden md:inline-block"
            >
              Continue Game
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
