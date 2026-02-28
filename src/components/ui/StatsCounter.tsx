'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './StatsCounter.module.css';

interface StatItemProps {
    endValue: number;
    suffix?: string;
    label: string;
    duration?: number;
}

const Counter = ({ endValue, suffix = '', label, duration = 2000 }: StatItemProps) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out expo
            const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

            setCount(Math.floor(endValue * easeOut));

            if (percentage < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isVisible, endValue, duration]);

    // Format number nicely
    const displayValue = count >= 1000 ? count.toLocaleString() : count.toString() + (count % 1 !== 0 && endValue % 1 !== 0 ? '' : '');
    // Exception for 4.9 rating
    const finalDisplay = endValue === 4.9 && count === Math.floor(4.9) ? Math.max(1, count) + ((count % 1 !== 0) ? '' : '') : displayValue; // Actually we'll just handle 4.9 separately if needed, or pass it.
    // Wait, let's make it simpler for floats. If endValue has decimals, just animate integers and snap to decimal? 
    // For 4.9 we can just animate 0 to 49 and divide by 10, or just hardcode the 4.9 final state.
    // Let's do integers and snap.

    return (
        <div ref={ref} className={styles.statBox}>
            <div className={styles.number}>
                {endValue === 4.9 && count === 4 ? "4.9" : displayValue}{suffix}
            </div>
            <div className={styles.label}>{label}</div>
        </div>
    );
};

export default function StatsCounter() {
    return (
        <div className={styles.stripWrapper}>
            <div className={`container ${styles.grid}`}>
                <Counter endValue={12400} suffix="+" label="PCs Optimized" />
                <Counter endValue={4.9} suffix="★" label="Average Rating" duration={1500} />
                <Counter endValue={3} label="Pro Tools Released" duration={1000} />
                <Counter endValue={99} suffix="%" label="Satisfaction Rate" duration={2500} />
            </div>
        </div>
    );
}
