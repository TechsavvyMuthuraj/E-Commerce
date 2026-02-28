'use client';
import { useState, useEffect } from 'react';

export default function GlobalBanner() {
    const [config, setConfig] = useState({ bannerActive: false, bannerText: '' });

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.bannerActive && data.bannerText) {
                    setConfig({ bannerActive: true, bannerText: data.bannerText });
                }
            })
            .catch(() => { });
    }, []);

    if (!config.bannerActive || !config.bannerText) return null;

    return (
        <div style={{
            background: 'var(--accent)',
            color: '#000',
            textAlign: 'center',
            padding: '0.6rem 1rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 0 15px rgba(255, 189, 46, 0.4)',
            zIndex: 9999,
            position: 'relative',
        }}>
            <span style={{
                display: 'inline-block',
                animation: 'pulse-text 2s infinite'
            }}>
                {config.bannerText}
            </span>
            <style jsx>{`
                @keyframes pulse-text {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}
