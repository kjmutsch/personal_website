"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';

export default function Resume() {
    const [items, setItems] = useState<{ id: number; title: string; company: string; years: string; description: string; }[]>([]);
    const { scrollY } = useScroll();
    const [hideArrow, setHideArrow] = useState(false);

    useEffect(() => {
        const newItems = [
            { id: 1, title: "Job Title", company: "Company Name", years: "Years Worked", description: "Short description of responsibilities..." },
            { id: 2, title: "Another Job Title", company: "Company Name", years: "Years Worked", description: "Short description of responsibilities..." }
        ];
        setItems(newItems);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.2) {
                setHideArrow(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#a8d8f0] to-[#2a485c] text-[#e5b76d] overflow-auto p-0 m-0 relative">
            <section className="flex flex-col justify-center items-center h-screen bg-[#5a8eaa] relative">
                <motion.div 
                    initial={{ opacity: 0, y: -50 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 1 }}
                    className="text-center relative">
                    <div className="relative p-4 border-8 border-dotted border-[#fad37b] rounded-full">
                        <Image 
                            src="/your-photo.jpg" 
                            alt="Your Picture" 
                            width={200} 
                            height={200} 
                            className="rounded-full"
                        />
                    </div>
                    <h2 className="text-2xl font-bold mt-5">About Me</h2>
                    <p>Short bio goes here...</p>
                </motion.div>
                
                {/* Decorative Doodles Around About Me Section */}
                <div className="absolute top-10 left-5 text-white text-6xl">★</div>
                <div className="absolute top-1/4 right-5 text-white text-6xl">❤</div>
                <div className="absolute bottom-1/3 left-5 text-white text-6xl">✿</div>
                <div className="absolute bottom-10 right-5 text-white text-6xl">🐱</div>
                {!hideArrow && (
                    <motion.div 
                        className="absolute bottom-10 animate-bounce text-4xl" 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}>
                        ↓
                    </motion.div>
                )}
            </section>

            {items.map((item, index) => (
                <motion.section 
                    key={item.id} 
                    className="min-h-screen flex flex-col justify-center items-center bg-transparent p-5 text-center" 
                    initial={{ opacity: 0, y: 100 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, amount: 0.5 }} 
                    transition={{ duration: 0.8 }}>
                    <h3 className="text-3xl font-semibold relative pb-2">
                        {item.title}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 border-b-4 border-white"></div>
                    </h3>
                    <p className="text-xl mt-5">{item.company} - {item.years}</p>
                    <p className="mt-3">{item.description}</p>
                </motion.section>
            ))}
        </div>
    );
}