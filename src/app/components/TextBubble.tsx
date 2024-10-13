"use client";
import React, { useEffect, useRef, useState } from 'react';

interface TextBubbleProps {
    ready: boolean;
}

function TextBubble({ready}: TextBubbleProps) {  
    const [delayedReady, setDelayedReady] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);


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
            setDelayedReady(false);
        }
    };

    return (
        <div ref={containerRef} className="speech overflow-auto" style={{ position: 'absolute', overflow: 'hidden', width: '650px', height: '400px', top: '320px'}}>
        {delayedReady && (
            <div className="speech-bubble">
                <img src="/images/speech/BITLY_INTRO.png" alt="speech-bubble" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
            </div>
        )}
    </div>
  );
}

export default TextBubble;
