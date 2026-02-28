'use client';
import { useState, useEffect, useRef } from 'react';

export default function TerminalLogger({ logs }: { logs: string[] }) {
    const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!logs || logs.length === 0) return;

        // Start with a boot sequence
        const seq = [
            'System v1.0.4 [AUTHORIZED USER]',
            `Logged in as ADMIN at ${new Date().toLocaleTimeString()}`,
            'Connecting to master database...',
            'SUCCESS // Link established',
            '==========================================',
            ...logs
        ];

        let i = 0;
        setVisibleLogs([]);

        const interval = setInterval(() => {
            if (i < seq.length) {
                setVisibleLogs(p => [...p, seq[i]]);
                i++;
                // Auto scroll to bottom
                setTimeout(() => {
                    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
            } else {
                clearInterval(interval);
            }
        }, 400); // 400ms delay between prints to simulate terminal feed

        return () => clearInterval(interval);
    }, [logs]);

    return (
        <div style={{
            background: '#040405',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#0f0',
            height: '350px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.02)'
        }}>
            <h2 style={{ color: '#fff', fontSize: '1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>&gt;_ Terminal Audit</span>
                <span className="blink" style={{ color: '#0f0' }}>LIVE</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                {visibleLogs.map((log, i) => (
                    <div key={i} style={{
                        opacity: i === visibleLogs.length - 1 ? 1 : 0.7,
                        textShadow: i === visibleLogs.length - 1 ? '0 0 5px rgba(0,255,0,0.5)' : 'none',
                        transition: 'opacity 0.3s'
                    }}>
                        {log.startsWith('>') || log.startsWith('SUCCESS') || log.startsWith('System') ?
                            log :
                            <span style={{ color: '#ffbd2e' }}>{log}</span>
                        }
                    </div>
                ))}
                <div ref={bottomRef} style={{ height: '2px' }} />
            </div>

            <style jsx>{`
                .blink { animation: blinker 1.5s linear infinite; }
                @keyframes blinker { 50% { opacity: 0; } }
                
                /* Custom Scrollbar for Terminal */
                div::-webkit-scrollbar { width: 6px; }
                div::-webkit-scrollbar-track { background: #000; }
                div::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
            `}</style>
        </div>
    );
}
