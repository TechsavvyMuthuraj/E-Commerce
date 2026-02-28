'use client';
import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
    const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    // Using refs for animation loop to avoid dependency issues
    const dotRef = React.useRef({ x: -100, y: -100 });
    const ringRef = React.useRef({ x: -100, y: -100 });
    const requestRef = React.useRef<number>(0);

    const lerp = (start: number, end: number, factor: number) => {
        return start + (end - start) * factor;
    };

    const animate = () => {
        ringRef.current.x = lerp(ringRef.current.x, dotRef.current.x, 0.15);
        ringRef.current.y = lerp(ringRef.current.y, dotRef.current.y, 0.15);
        setRingPosition({ x: ringRef.current.x, y: ringRef.current.y });
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            dotRef.current = { x: e.clientX, y: e.clientY };
            setDotPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                window.getComputedStyle(target).cursor === 'pointer'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        requestRef.current = requestAnimationFrame(animate);

        // Hide default cursor on body
        document.body.style.cursor = 'none';
        const style = document.createElement('style');
        style.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(style);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            cancelAnimationFrame(requestRef.current);
            document.body.style.cursor = 'auto';
            document.head.removeChild(style);
        };
    }, []);

    return (
        <>
            {/* Lagging Ring */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: isHovering ? '40px' : '24px',
                    height: isHovering ? '40px' : '24px',
                    border: isHovering ? '2px solid rgba(245, 166, 35, 0.8)' : '1px solid rgba(245, 166, 35, 0.5)',
                    backgroundColor: isHovering ? 'rgba(245, 166, 35, 0.1)' : 'transparent',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: `translate(calc(${ringPosition.x}px - 50%), calc(${ringPosition.y}px - 50%))`,
                    transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease',
                    zIndex: 99998,
                    mixBlendMode: 'difference',
                }}
            />
            {/* Instant Dot */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'rgba(245, 166, 35, 1)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    transform: `translate(calc(${dotPosition.x}px - 50%), calc(${dotPosition.y}px - 50%))`,
                    opacity: isHovering ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                    zIndex: 99999,
                    mixBlendMode: 'difference',
                }}
            />
        </>
    );
}
