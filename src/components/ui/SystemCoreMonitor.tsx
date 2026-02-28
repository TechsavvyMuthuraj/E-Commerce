'use client';
import { useState, useEffect } from 'react';

export default function SystemCoreMonitor() {
    const [latency, setLatency] = useState(0);
    const [uptime, setUptime] = useState('0s');
    const [dbStatus, setDbStatus] = useState('CONNECTED');

    // Real live metrics
    useEffect(() => {
        // Measure real API latency by pinging our stats endpoint
        const measureLatency = async () => {
            const start = performance.now();
            try {
                await fetch('/api/admin/stats', { method: 'HEAD' });
                const time = Math.floor(performance.now() - start);
                setLatency(time);
                setDbStatus('CONNECTED');
            } catch (e) {
                setLatency(999);
                setDbStatus('DISCONNECTED');
            }
        };

        measureLatency();
        const intLatency = setInterval(measureLatency, 5000); // Check every 5s

        // Record mount time for uptime
        const startTime = Date.now();
        const intUptime = setInterval(() => {
            const diff = Math.floor((Date.now() - startTime) / 1000);
            const m = Math.floor(diff / 60);
            const s = diff % 60;
            const h = Math.floor(m / 60);

            if (h > 0) setUptime(`${h}h ${m % 60}m ${s}s`);
            else if (m > 0) setUptime(`${m}m ${s}s`);
            else setUptime(`${s}s`);
        }, 1000);

        return () => {
            clearInterval(intLatency);
            clearInterval(intUptime);
        };
    }, []);

    return (
        <div style={{
            background: '#040405',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
            padding: '1.5rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'inset 0 0 20px rgba(0, 255, 0, 0.02)',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Background animated grid lines matching terminal vibe */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0, 255, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none',
                opacity: 0.5
            }} />

            <h2 style={{ color: '#fff', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                🎛️ System Core Health
                <div className="pulse-dot" style={{ background: '#4CAF50', width: '8px', height: '8px', borderRadius: '50%', marginLeft: 'auto' }} />
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', position: 'relative' }}>

                {/* Metric 1: API Latency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>Global Edge API</span>
                        <span style={{ color: '#fff', fontSize: '1.1rem' }}>{latency}ms Response</span>
                    </div>
                    <div style={{ color: '#4CAF50', fontSize: '1.2rem' }}>⚡</div>
                </div>

                {/* Metric 2: DB Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #111', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>PostgreSQL Node</span>
                        <span style={{ color: dbStatus === 'CONNECTED' ? '#0f0' : '#ff5f56', fontSize: '1.1rem', textShadow: dbStatus === 'CONNECTED' ? '0 0 8px rgba(0,255,0,0.4)' : 'none' }}>{dbStatus}</span>
                    </div>
                    <div style={{ color: dbStatus === 'CONNECTED' ? '#2196F3' : '#ff5f56', fontSize: '1.2rem', animation: dbStatus === 'CONNECTED' ? 'spin 4s linear infinite' : 'none' }}>⚙️</div>
                </div>

                {/* Metric 3: Uptime */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #111', paddingTop: '1.25rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px' }}>Session Uptime</span>
                        <span style={{ color: '#fff', fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums' }}>{uptime}</span>
                    </div>
                    <div style={{ color: '#f5a623', fontSize: '1.2rem' }}>🟢</div>
                </div>

            </div>

            <style jsx>{`
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                    100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
                .pulse-dot { animation: pulse-ring 2s infinite; }
                
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
