"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';

interface RobotProps {
    ready: boolean;
    setBackgroundPosition: Dispatch<SetStateAction<number>>;
}

function Robot({ready, setBackgroundPosition}: RobotProps) {
    const [introduction, setIntroduction] = useState(true); // If we're introducing Bitly we run a different animation
    const [isMovingForward, setIsMovingForward] = useState(false);
    const [isMovingBackward, setIsMovingBackward] = useState(false); // Track if Bitly is moving
    const [isRotating, setIsRotating] = useState(false); // Tires rotating or not
    const [jump, setJump] = useState(false); // Bitly currently jumping
    const jumpRef = useRef(false)
    const [lastMovement, setLastMovement] = useState<string | null>(null); // saving last movement so I know what direction to animate tires

    const rotationValue = useMotionValue(0);    
    const containerRef = useRef<HTMLDivElement | null>(null);
    const movementInterval = useRef<number | null>(null); // Store interval ID for movement
    const groundYPosition = 55;
    const jumpHeight = -20;
  
    // Function to start movement when key is held down
    const startMovement = (forwards: boolean) => {
        if (!movementInterval.current) {
            movementInterval.current = window.setInterval(() => {
                const moveSpeed = 10;
                setIsRotating(true);
                setBackgroundPosition((prev) => prev - (forwards ? moveSpeed / 2 : -(moveSpeed/2)));
            }, 40); // Update position every 30ms
        }
    };

    // Function to stop movement when key is released
    const stopMovement = () => {
        if (movementInterval.current) {
            setIsRotating(false);
            clearInterval(movementInterval.current); // Clear the interval
            movementInterval.current = null;
        }
    };

    // Handle keydown events
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === " " && introduction && !jumpRef.current) {
            setJump(true);
            jumpRef.current = true;
            setIntroduction(false);
        } else if(event.key === " " && !jumpRef.current) {
            setJump(true); // Trigger jump
            jumpRef.current = true;
        } 

        if ((event.key === 'ArrowRight' || event.key === 'd') && !introduction) {
            setIsMovingForward(true); // Start moving when key is pressed
            setLastMovement('ArrowRight')
        }
        if ((event.key === 'ArrowLeft' || event.key === 'a') && !introduction) {
            setIsMovingBackward(true); // Start moving when key is pressed
            setLastMovement('ArrowLeft')
        }
    };

    // Handle keyup events to stop motion
    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight' || event.key === 'd') {
            setIsMovingForward(false); // Stop the motion on key up
        } else if ((event.key === 'ArrowLeft' || event.key === 'a')) {
            setIsMovingBackward(false); // Start moving when key is pressed
        }

    };

    // Add event listener for key presses
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const container = containerRef.current;
            if (container) {
                container.focus();
                window.addEventListener('keydown', handleKeyDown);
                window.addEventListener('keyup', handleKeyUp);
            }

            // Cleanup the event listener when the component unmounts
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            };
        }
    }, [introduction]);

    // Use effect to start and stop the continuous movement
    useEffect(() => {
        if (isMovingForward) {
            startMovement(true);
        } else if (isMovingBackward) {
            startMovement(false);
        } else {
            stopMovement();
        }

        // Clean up the interval when the component unmounts
        return () => {
            stopMovement();
        };
    }, [isMovingForward, isMovingBackward]);

    useEffect(() => {
        const rotVal = isMovingBackward || lastMovement === 'ArrowLeft' ? -360 : 360;
        if (isRotating) {
            animate(rotationValue, rotationValue.get() + rotVal, {
                duration: 1,
                ease: 'linear',
                onUpdate: (latest) => {
                    rotationValue.set(latest % rotVal); // Normalize the rotation between 0 and 360
                },
                repeat: Infinity
            });
        } else {
            // stopping, allow for a couple more rotations
            animate(rotationValue, rotationValue.get() + rotVal, {
                duration: 1,
                ease: 'easeOut', // Ease out smoothly
            });
        }
    }, [isRotating, rotationValue, isMovingForward, isMovingBackward]);

    // Manage jump effect
    useEffect(() => {
        if (jump) {
            const jumpDuration = 500;
            const jumpAnimation = setTimeout(() => {
                setJump(false); // Reset jump
                jumpRef.current = false;
            }, jumpDuration);
            return () => clearTimeout(jumpAnimation);
        }
    }, [jump]);

    return (
        <div style={{ outline: 'none', position: 'relative', height: '100vh', overflow: 'hidden' }}
            tabIndex={0} // A div is not focusable by default and this makes div focusable
            ref={containerRef}
        >
        {ready && (
            <motion.div
                className="bitly"
                initial={{ x: '-50vw' }}
                animate={{ x: 100 }} // Move on the x-axis
                transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 15, // bounce
                    duration: introduction ? 1.5 : 0.5
                }}
                style={{ position: "absolute"}}
            >
                {/* Bitly's body will jump by altering the y-axis here */}
                <motion.div
                    animate={{
                        y: jump ? [groundYPosition, jumpHeight, groundYPosition] : groundYPosition // Handle jump on y-axis
                    }}
                    transition={{
                        duration: 0.5, // Jump duration
                        ease: 'easeInOut',
                    }}
                >
                    {/* Robot's body */}
                    <div className="body">
                        <img src="/images/robot/body.png" alt="Body" />
                    </div>

                    {/* Left Arm */}
                    <motion.img
                        src="images/robot/robot_left.png"
                        className="left-arm"
                        animate={isRotating ? { rotate: [10, -10, 10] } : { rotate: 0 }}
                        transition={{
                            duration: 0.5, // Duration of each swing
                            repeatType: "mirror", // Mirror the animation to swing back and forth
                        }}
                        style={{ position: 'absolute', top: '55px', left: '-3px' }}
                    />

                    {/* Right Arm */}
                    <motion.img
                        src="images/robot/robot_right.png"
                        className="right-arm"
                        animate={isRotating ? { rotate: [-10, 10, -10] } : { rotate: 0 }}
                        transition={{
                            duration: 0.5,
                            repeatType: "mirror",
                        }}
                        style={{ position: 'absolute', top: '55px', left: '72px' }}
                    />

                    {/* Left Wheel */}
                    <motion.img
                    src="images/robot/robot_wheel.png"
                        className="left-wheel"
                        style={{ position: 'absolute', top: '95px', left: '20px', rotate: rotationValue }}
                    />

                    {/* Right Wheel */}
                    <motion.img
                        src="images/robot/robot_wheel.png"
                        className="right-wheel"
                        style={{ position: 'absolute', top: '95px', left: '50px', rotate: rotationValue }}
                    />
                </motion.div>
            </motion.div>
        )}
    </div>
  );
}

export default Robot;
