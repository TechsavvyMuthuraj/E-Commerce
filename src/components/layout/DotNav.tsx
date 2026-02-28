'use client';
import { useEffect, useState } from 'react';

export default function DotNav() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress(currentScrollY / scrollHeight);
            }
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    // We'll define 5 logical scroll points
    const dots = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div style={{
            position: 'fixed',
            right: '2vw',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            zIndex: 9997,
            pointerEvents: 'none',
            mixBlendMode: 'difference'
        }}>
            {dots.map((dot, i) => {
                // Determine which dot is most "active" based on scroll progress
                const distance = Math.abs(progress - dot);
                const isActive = distance < 0.15;
                const isClosest = Math.abs(progress - dot) === Math.min(...dots.map(d => Math.abs(progress - d)));

                return (
                    <div key={i} style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isClosest ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        transform: isClosest ? 'scale(2)' : 'scale(1)',
                        boxShadow: isClosest ? '0 0 10px var(--accent)' : 'none',
                        opacity: isClosest ? 1 : 0.5
                    }} />
                );
            })}
        </div>
    );
}
