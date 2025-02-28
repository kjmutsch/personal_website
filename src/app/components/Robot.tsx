"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
// Framer Motion differs from react because react makes a virtual DOM, compares it to the previous one, calculates the minimum changes needed,
// then batches these changes and updates the real DOM
// whereas FM updates the DOM elements directly and uses browser's requestAnimationFrame API 
import { useAppDispatch } from "../../redux/store";
import { setIsJumping, setIsMovingBackward, setIsMovingForwards } from "../../redux/appSlice";

interface RobotProps {
    ready: boolean;
    setBackgroundPosition: Dispatch<SetStateAction<number>>;
    setDistantBackgroundPosition: Dispatch<SetStateAction<number>>;
}

function Robot({ ready, setBackgroundPosition, setDistantBackgroundPosition }: RobotProps) {
    const dispatch = useAppDispatch();
    const [introduction, setIntroduction] = useState(true);
    const [isMovingForward, setMovingForward] = useState(false);
    const [isMovingBackwards, setMovingBackward] = useState(false);
    const [jump, setJump] = useState(false);
    const jumpRef = useRef(false);
    const lastMovement = useRef<string | null>(null);

    // useMotionValue does not cause component re-renders when the value changes, use when values change frequently
    // allows for use of animate function (useState doesn't work well bc it causes rerenders and react batches state updates so animation updates would maybe get grouped together)
    // with motion values
    // Framer Motion updates the DOM directly without going through react's reconciliation process
    // gives more control over animation sequence through chaining.
    // Chaining means running animations in sequence without interruption
    const rotationValue = useMotionValue(0); 
    const yPositionValue = useMotionValue(55); // Start at groundYPosition
    const containerRef = useRef<HTMLDivElement | null>(null);
    const groundYPosition = 55;
    const jumpHeight = -20;

    const backgroundPositionRef = useRef(0);
    const distantPositionRef = useRef(0);
    const frameRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);

    const moveSpeed = 6;
    const sunSpeed = 2;

    // **Smooth movement using requestAnimationFrame**
    const moveRobot = (timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const deltaTime = (timestamp - lastTimestampRef.current) / 16.67; // Normalize to 60 FPS
        lastTimestampRef.current = timestamp;

        if (isMovingForward || isMovingBackwards) {
            const direction = isMovingForward ? -1 : 1;

            // Consistent movement speed across frame rates
            backgroundPositionRef.current += moveSpeed * direction * deltaTime;
            distantPositionRef.current += sunSpeed * direction * deltaTime;

            setBackgroundPosition(backgroundPositionRef.current);
            setDistantBackgroundPosition(distantPositionRef.current);

            frameRef.current = requestAnimationFrame(moveRobot);
        }
    };

    useEffect(() => {
        if (isMovingForward || isMovingBackwards) {
            frameRef.current = requestAnimationFrame(moveRobot);
        } else if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            lastTimestampRef.current = null;
        }
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isMovingForward, isMovingBackwards]);

    // **Handle Wheel Rotation**
    useEffect(() => {
        if (isMovingForward || isMovingBackwards) {
            const direction = isMovingBackwards ? -1 : 1; // Reverse when moving backward

            animate(rotationValue, rotationValue.get() + 360 * direction, {
                duration: 1,
                ease: 'linear',
                repeat: Infinity,
            });
        } else {
            // Stop rotation smoothly when movement stops
            animate(rotationValue, rotationValue.get(), { duration: 0.3, ease: 'easeOut' });
        }
    }, [isMovingForward, isMovingBackwards]);

    // **Handle Jump Animation**
    useEffect(() => {
        if (jump) {
            // Going up animation
            animate(yPositionValue, jumpHeight, {
                duration: 0.2,
                ease: "easeOut",
                onComplete: () => {
                    // Coming down animation - no spring, just smooth easeIn
                    animate(yPositionValue, groundYPosition, {
                        duration: 0.3,
                        ease: "easeIn",
                        onComplete: () => {
                            setJump(false);
                            jumpRef.current = false;
                            dispatch(setIsJumping(false));
                        }
                    });
                }
            });
        }
    }, [jump, dispatch]);

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
    }, [introduction, dispatch]);

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
                    <motion.div style={{ y: yPositionValue }}> 
                        {/* direct connection between yPositionValue and the DOM element's transform property */}
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