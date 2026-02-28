'use client';
import { useState, useEffect } from 'react';

export default function TerminalBlock({ lines }: { lines: string[] }) {
    const [visibleLines, setVisibleLines] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleLines(prev => (prev < lines.length ? prev + 1 : prev));
        }, 600);
        return () => clearInterval(interval);
    }, [lines.length]);

    return (
        <div style={{
            background: '#0a0a0c',
            border: '1px solid #222',
            borderRadius: '6px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: '#27c93f',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Window Controls */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            </div>

            {/* Terminal Content */}
            {lines.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{
                    marginBottom: '0.7rem',
                    color: line.startsWith('>') ? 'var(--accent)' : (line.startsWith('#') ? '#888' : '#a1a1aa')
                }}>
                    {line}
                </div>
            ))}

            {/* Blinking Cursor */}
            {visibleLines < lines.length && (
                <div style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '15px',
                    background: 'var(--accent)',
                    animation: 'blink 1s step-end infinite',
                    verticalAlign: 'text-bottom'
                }} />
            )}
            <style jsx>{`
                @keyframes blink { 
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; } 
                }
            `}</style>
        </div>
    );
}
