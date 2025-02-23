"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { useAppDispatch } from "../../redux/store";
import { setIsJumping, setIsMovingBackward, setIsMovingForwards } from "../../redux/appSlice";

interface RobotProps {
    ready: boolean;
    setBackgroundPosition: Dispatch<SetStateAction<number>>;
    setDistantBackgroundPosition: Dispatch<SetStateAction<number>>;
    setCloudPosition: Dispatch<SetStateAction<number>>;
}

function Robot({ ready, setBackgroundPosition, setDistantBackgroundPosition, setCloudPosition }: RobotProps) {
    const dispatch = useAppDispatch();
    const [introduction, setIntroduction] = useState(true);
    const [isMovingForward, setMovingForward] = useState(false);
    const [isMovingBackward, setMovingBackward] = useState(false);
    const [jump, setJump] = useState(false);
    const jumpRef = useRef(false);
    const lastMovement = useRef<string | null>(null);

    const rotationValue = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const groundYPosition = 55;
    const jumpHeight = -20;

    const backgroundPositionRef = useRef(0);
    const distantPositionRef = useRef(0);
    const cloudPositionRef = useRef(0);
    const frameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    const moveSpeed = 8;
    const parallaxSpeed = 10;
    const sunSpeed = moveSpeed / 1.5;

    // **Smooth movement using requestAnimationFrame**
    const moveRobot = (timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const deltaTime = (timestamp - lastTimestampRef.current) / 16.67; // Normalize to 60 FPS
        lastTimestampRef.current = timestamp;

        if (isMovingForward || isMovingBackward) {
            const direction = isMovingForward ? -1 : 1;

            // Consistent movement speed across frame rates
            backgroundPositionRef.current += moveSpeed * direction * deltaTime;
            distantPositionRef.current += sunSpeed * direction * deltaTime;
            cloudPositionRef.current += parallaxSpeed * direction * deltaTime;

            setBackgroundPosition(backgroundPositionRef.current);
            setDistantBackgroundPosition(distantPositionRef.current);
            setCloudPosition(cloudPositionRef.current);

            frameRef.current = requestAnimationFrame(moveRobot);
        }
    };

    useEffect(() => {
        if (isMovingForward || isMovingBackward) {
            frameRef.current = requestAnimationFrame(moveRobot);
        } else if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            lastTimestampRef.current = null;
        }
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isMovingForward, isMovingBackward]);

    // **Handle Wheel Rotation**
    useEffect(() => {
        if (isMovingForward || isMovingBackward) {
            const direction = isMovingBackward ? -1 : 1; // Reverse when moving backward

            animate(rotationValue, rotationValue.get() + 360 * direction, {
                duration: 1,
                ease: 'linear',
                repeat: Infinity,
            });
        } else {
            // Stop rotation smoothly when movement stops
            animate(rotationValue, rotationValue.get(), { duration: 0.3, ease: 'easeOut' });
        }
    }, [isMovingForward, isMovingBackward]);

    // **Handle Key Presses**
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === " " && introduction && !jumpRef.current) {
                setJump(true);
                jumpRef.current = true;
                dispatch(setIsJumping(true));
                setIntroduction(false);
            } else if (event.key === " " && !jumpRef.current) {
                setJump(true);
                jumpRef.current = true;
                dispatch(setIsJumping(true));
            }

            if ((event.key === 'ArrowRight' || event.key === 'd') && !introduction) {
                setMovingForward(true);
                dispatch(setIsMovingBackward(false));
                dispatch(setIsMovingForwards(true));
                lastMovement.current = 'ArrowRight';
            }
            if ((event.key === 'ArrowLeft' || event.key === 'a') && !introduction) {
                setMovingBackward(true);
                dispatch(setIsMovingBackward(true));
                dispatch(setIsMovingForwards(false));
                lastMovement.current = 'ArrowLeft';
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.key === 'ArrowRight' || event.key === 'd') {
                setMovingForward(false);
                dispatch(setIsMovingForwards(false));
            } else if ((event.key === 'ArrowLeft' || event.key === 'a')) {
                setMovingBackward(false);
                dispatch(setIsMovingBackward(false));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [introduction]);

    // **Manage Jump Effect (with setIsJumping)**
    useEffect(() => {
        if (jump) {
            setTimeout(() => {
                setJump(false);
                jumpRef.current = false;
                dispatch(setIsJumping(false)); // ✅ Reset isJumping when landing
            }, 500);
        }
    }, [jump]);

    return (
        <div
            style={{ outline: 'none', position: 'relative', height: '100vh', overflow: 'hidden', zIndex: 999 }}
            tabIndex={0}
            ref={containerRef}
        >
            {ready && (
                <motion.div
                    className="bitly"
                    initial={{ x: '-50vw' }}
                    animate={{ x: 100 }}
                    transition={{
                        type: 'spring',
                        stiffness: 50,
                        damping: 15,
                        duration: introduction ? 1.5 : 0.5,
                    }}
                    style={{ position: "absolute" }}
                >
                    <motion.div
                        animate={{
                            y: jump ? [groundYPosition, jumpHeight, groundYPosition] : groundYPosition,
                        }}
                        transition={{
                            duration: 0.5,
                            ease: 'easeInOut',
                        }}
                    >
                        {/* Robot's body */}
                        <div className="body">
                            <img src="/images/robot/body.png" alt="Body" />
                        </div>

                        {/* Left Arm */}
                        <img
                            src="images/robot/robot_left.png"
                            className="left-arm"
                            style={{ position: 'absolute', top: '45px', left: '-3px' }}
                        />

                        {/* Right Arm */}
                        <img
                            src="images/robot/robot_right.png"
                            className="right-arm"
                            style={{ position: 'absolute', top: '45px', left: '72px' }}
                        />

                        {/* Left Wheel */}
                        <motion.img
                            src="images/robot/robot_wheel.png"
                            className="left-wheel"
                            style={{ position: 'absolute', top: '85px', left: '20px', rotate: rotationValue }}
                        />

                        {/* Right Wheel */}
                        <motion.img
                            src="images/robot/robot_wheel.png"
                            className="right-wheel"
                            style={{ position: 'absolute', top: '85px', left: '50px', rotate: rotationValue }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

export default Robot;
