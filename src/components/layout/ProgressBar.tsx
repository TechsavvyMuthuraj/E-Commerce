'use client';
import { useEffect, useState } from 'react';

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScrollY = window.scrollY;
            const scrollHeight = document.body.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentScrollY / scrollHeight).toFixed(2)) * 100);
            }
        };

        // Initial setup + event listener
        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${progress}%`,
            height: '3px',
            backgroundColor: 'var(--accent)',
            zIndex: 99998,
            transition: 'width 0.1s ease-out',
            boxShadow: '0 0 15px var(--accent), 0 0 5px var(--accent)',
            pointerEvents: 'none'
        }} />
    );
}
