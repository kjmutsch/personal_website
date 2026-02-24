"use client";
import React, { useEffect, useRef, useState } from 'react';

interface TextBubbleProps {
    ready: boolean;
    scale: number;
}

function TextBubble({ready, scale}: TextBubbleProps) {
    const [delayedReady, setDelayedReady] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Scale the dimensions based on viewport height
    const bubbleWidth = 650 * scale;
    const bubbleHeight = 400 * scale;
    const bubbleTop = 300 * scale;


    const handleDelay = async () => {
        // Delay so robot is on screen before speech bubble pops up
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(2000);

        setDelayedReady(true);
      };

    useEffect(() => {
        if(ready) {
            handleDelay();
        }
    }, [ready])

        // Add event listener for key presses
        useEffect(() => {
            if (typeof window !== 'undefined') {
                const container = containerRef.current;
                if (container) {
                    container.focus();
                    window.addEventListener('keydown', handleKeyDown);
                }
    
                // Cleanup the event listener when the component unmounts
                return () => {
                    window.removeEventListener('keydown', handleKeyDown);
                };
            }
        }, []);

    // Handle keydown event
    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === " ") {
            setDelayedReady(false)
        }
    };

    return (
        <div ref={containerRef} className="overflow-auto" style={{ position: 'absolute', overflow: 'hidden', width: `${bubbleWidth}px`, height: `${bubbleHeight}px`, top: `${bubbleTop}px`}}>
            {delayedReady && (
                <div style={{position: 'absolute',zIndex: 999}}>
                    <img src="/images/speech/BITLY_INTRO.png" alt="speech-bubble" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                </div>
            )}
    </div>
  );
}

export default TextBubble;
