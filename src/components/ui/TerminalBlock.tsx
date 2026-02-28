'use client';
import { useState, useEffect } from 'react';

export default function TerminalBlock({ lines }: { lines: string[] }) {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    useEffect(() => {
        if (currentLineIndex >= lines.length) return;

        const currentLineText = lines[currentLineIndex];

        // If we haven't finished typing the current line
        if (currentCharIndex < currentLineText.length) {
            const timeout = setTimeout(() => {
                const nextChar = currentLineText[currentCharIndex];

                setVisibleLines(prev => {
                    const newLines = [...prev];
                    if (newLines[currentLineIndex] === undefined) {
                        newLines[currentLineIndex] = '';
                    }
                    newLines[currentLineIndex] += nextChar;
                    return newLines;
                });

                // Add variable typing speed for realism
                setCurrentCharIndex(prev => prev + 1);
            }, Math.random() * 20 + 10); // Very fast typing 10-30ms per char

            return () => clearTimeout(timeout);
        } else {
            // Line finished, pause before starting next line
            const timeout = setTimeout(() => {
                setCurrentLineIndex(prev => prev + 1);
                setCurrentCharIndex(0);
            }, 300); // 300ms pause between lines

            return () => clearTimeout(timeout);
        }
    }, [currentLineIndex, currentCharIndex, lines]);

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
            overflow: 'hidden',
            minHeight: '250px'
        }}>
            {/* Window Controls */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '1rem' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
            </div>

            {/* Terminal Content */}
            {visibleLines.map((line, i) => (
                <div key={i} style={{
                    marginBottom: '0.7rem',
                    color: lines[i].startsWith('>') ? 'var(--accent)' : (lines[i].startsWith('#') ? '#888' : '#a1a1aa')
                }}>
                    {line}
                    {/* Render blinking cursor on the active line */}
                    {i === currentLineIndex && currentLineIndex < lines.length && (
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '15px',
                            background: 'var(--accent)',
                            animation: 'blink 1s step-end infinite',
                            verticalAlign: 'text-bottom',
                            marginLeft: '4px'
                        }} />
                    )}
                </div>
            ))}

            {/* Render blinking cursor on a new line if waiting to start a new line, or at the very end */}
            {(currentLineIndex >= visibleLines.length) && (
                <div style={{ marginBottom: '0.7rem' }}>
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '15px',
                        background: 'var(--accent)',
                        animation: 'blink 1s step-end infinite',
                        verticalAlign: 'text-bottom'
                    }} />
                </div>
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
