"use client";
import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';

interface RobotProps {
    ready: boolean;
}

function Robot({ready}: RobotProps) {
    const [introduction, setIntroduction] = useState(true); // If we're introducing Bitly we run a different animation
    const [position, setPosition] = useState(100); // Position for the character
    const [isMoving, setIsMoving] = useState(false); // Track if Bitly is moving
    const [isRotating, setIsRotating] = useState(false); // Tires rotating or not
    const [jump, setJump] = useState(false); // Bitly currently jumping
    const [isJumping, setIsJumping] = useState(false); 

    const rotationValue = useMotionValue(0);
    
    const containerRef = useRef<HTMLDivElement | null>(null);
    const movementInterval = useRef<number | null>(null); // Store interval ID for movement

    const groundYPosition = 55;
    const jumpHeight = -20;
  
    // Function to start movement when key is held down
    const startMovement = () => {
        if (!movementInterval.current) {
            movementInterval.current = window.setInterval(() => {
            setIsRotating(true);
            setPosition((prevPosition) => prevPosition + 10); // Increase position by 10px every interval
            }, 50); // Update position every 50ms
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
        if (event.key === " " && introduction) {
            setJump(true);
            setIntroduction(false);
        } else if(event.key === " " && !isJumping) {
            setJump(true); // Trigger jump
        } 
        
        if ((event.key === 'ArrowRight' || event.key === 'd') && !introduction && !isJumping) {
            setIsMoving(true); // Start moving when key is pressed
        }
    };

    // Handle keyup events to stop motion
    const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight' || event.key === 'd') {
            setIsMoving(false); // Stop the motion on key up
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
        if (isMoving) {
            startMovement();
        } else {
            stopMovement();
        }

        // Clean up the interval when the component unmounts
        return () => {
            stopMovement();
        };
    }, [isMoving]);

    useEffect(() => {
        if (isRotating) {
            animate(rotationValue, rotationValue.get() + 360, {
                duration: 1,
                ease: 'linear',
                onUpdate: (latest) => {
                    rotationValue.set(latest % 360); // Normalize the rotation between 0 and 360
                },
                repeat: Infinity
            });
        } else {
            // stopping, allow for a couple more rotations
            animate(rotationValue, rotationValue.get() + 360, {
                duration: 1,
                ease: 'easeOut', // Ease out smoothly
            });
        }
    }, [isRotating, rotationValue]);

    // Manage jump effect
    useEffect(() => {
        if (jump) {
            const jumpDuration = 0.5;
            const jumpAnimation = setTimeout(() => {
                setJump(false); // Reset jump
            }, jumpDuration * 1000);

            return () => clearTimeout(jumpAnimation);
        }
    }, [jump]);

    return (
        <div className="Robot"
            style={{ outline: 'none', position: 'relative', height: '100vh', overflow: 'hidden' }}
            tabIndex={0} // A div is not focusable by default and this makes div focusable
            ref={containerRef}
        >
        {ready && (
            <motion.div
                className="bitly"
                initial={{ x: '-50vw' }}
                animate={{ x: introduction ? 100 : position }} // Move on the x-axis
                transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 15, // bounce
                    duration: introduction ? 1.5 : 0.5
                }}
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
                        <img src="/images/body.png" alt="Body" />
                    </div>

                    {/* Left Arm */}
                    <motion.img
                        src="images/robot_left.png"
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
                        src="images/robot_right.png"
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
                    src="images/robot_wheel.png"
                        className="left-wheel"
                        style={{ position: 'absolute', top: '95px', left: '20px', rotate: rotationValue }}
                    />

                    {/* Right Wheel */}
                    <motion.img
                        src="images/robot_wheel.png"
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
