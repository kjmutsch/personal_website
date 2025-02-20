"use client";

import { useState } from "react";
import Start from "../components/Start";
import TextBubble from "../components/TextBubble";

export default function ResumePage() {
  const [onStart, setOnStart] = useState(true);
  const [showBackground, setShowBackground] = useState(false);
  const [ready, setReady] = useState(false);

  const handleStart = async () => {
    setOnStart(false);
    setShowBackground(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setReady(true);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
        <div className="resume-content">
          <TextBubble ready={ready} />
          <section className="level">
            <h2>Levels Completed (Experience)</h2>
            <p>Software Engineer at XYZ - 2020-2024</p>
            <p>Frontend Developer at ABC - 2018-2020</p>
          </section>
          <section className="level">
            <h2>Inventory (Skills)</h2>
            <p>React, JavaScript, HTML, CSS, Node.js</p>
            <p>UI/UX Design, Project Management</p>
          </section>
          <section className="level">
            <h2>Power-Ups (Certifications & Achievements)</h2>
            <p>Certified Web Developer - 2021</p>
            <p>Scrum Master Certification - 2022</p>
          </section>
        </div>
    </div>
  );
}