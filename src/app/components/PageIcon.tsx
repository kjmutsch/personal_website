// In-world page icon: collides with the robot and triggers a route transition.
"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PageIconProps {
  x: number;
  y: number;
  route: string;
  id: string;
  backgroundPosition: number;
  robotY: number;
  onEnter: (route: string) => void;
  icon?: string;
}

const PageIcon = ({ x, y, route, id, backgroundPosition, robotY, onEnter, icon = "/images/objects/page_icon.png" }: PageIconProps) => {
  const [entered, setEntered] = useState(false);
  const isJumping = useSelector((state: RootState) => state.app.isJumping);
  const animationFrameRef = useRef<number | null>(null);
  // Tracks whether the robot was already overlapping last frame. If it spawned
  // on top of the icon (resuming from this page), we wait until it leaves and
  // re-enters before firing onEnter again.
  const wasOverlappingRef = useRef<boolean | null>(null);

  const iconWidth = 80;
  const iconHeight = 80;

  useEffect(() => {
    if (entered) return;

    const checkCollision = () => {
      const whitespace = 10;
      const robotYCenter = 70 / 2;
      const robotX = 100;
      const robotWidth = 75;
      const jumpOffset = isJumping ? 20 + robotYCenter : 0;
      const robotYPosition = robotY - jumpOffset;

      const iconScreenX = x + backgroundPosition;
      const robotCenterX = robotX + robotWidth / 2;
      const iconCenterX = iconScreenX + iconWidth / 2;
      const iconBottom = y - whitespace;

      const overlapX = Math.abs(robotCenterX - iconCenterX) < (robotWidth + iconWidth) / 2;
      const overlapY = robotYPosition <= iconBottom;
      const isOverlapping = overlapX && overlapY;

      // First frame: seed prior state so an already-overlapping spawn doesn't
      // immediately trigger a re-entry.
      if (wasOverlappingRef.current === null) {
        wasOverlappingRef.current = isOverlapping;
      } else if (isOverlapping && !wasOverlappingRef.current) {
        setEntered(true);
        onEnter(route);
        return;
      } else {
        wasOverlappingRef.current = isOverlapping;
      }

      animationFrameRef.current = requestAnimationFrame(checkCollision);
    };

    animationFrameRef.current = requestAnimationFrame(checkCollision);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [entered, x, y, route, onEnter, backgroundPosition, isJumping, robotY]);

  if (entered) return null;

  return (
    <img
      src={icon}
      alt={`Page: ${id}`}
      className="absolute"
      style={{
        left: `${x + backgroundPosition}px`,
        top: `${y}px`,
        width: `${iconWidth}px`,
        height: `${iconHeight}px`,
        zIndex: 9,
      }}
    />
  );
};

export default PageIcon;
