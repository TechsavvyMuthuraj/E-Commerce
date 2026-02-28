'use client';
import { useMemo } from 'react';

export default function SEOAnalyzer({ title, excerpt, body }: { title: string; excerpt: string; body: string }) {

    // Live calculate metrics
    const stats = useMemo(() => {
        const words = body.trim() ? body.trim().split(/\s+/).length : 0;
        const readTime = Math.ceil(words / 225) || 1; // avg adult reads 225 wpm

        // Count headings (H2, H3)
        const headings = (body.match(/^#{2,3}\s/gm) || []).length;

        // Count links
        const links = (body.match(/\[.*?\]\(.*?\)/g) || []).length;

        // Calculate a pseudo SEO Score out of 100
        let score = 0;
        if (title.length > 20) score += 15;
        if (title.length > 40) score += 10; // Catchy titles are usually longer
        if (excerpt.length > 50) score += 15;
        if (words > 300) score += 20; // Needs some meat
        if (words > 800) score += 10; // Long-form gets a bonus
        if (headings > 2) score += 15; // Structure
        if (links > 0) score += 15; // Outbound/Inbound links are good

        return { words, readTime, headings, links, score: Math.min(100, score) };
    }, [title, excerpt, body]);

    // Determine color based on score
    const scoreColor = stats.score > 80 ? '#4CAF50' : stats.score > 50 ? '#FFC107' : '#ff5f56';

    return (
        <div style={{
            background: '#040405',
            border: '1px solid #1a1a1a',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            position: 'sticky',
            top: '20px'
        }}>
            <h3 style={{ color: '#fff', fontSize: '0.95rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1a1a1a', paddingBottom: '0.5rem' }}>
                <span>🎯 Live SEO Analyzer</span>
                <span style={{ color: scoreColor, fontWeight: 'bold' }}>{stats.score}/100</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>Word Count</span>
                    <span style={{ color: stats.words > 300 ? '#4CAF50' : '#888' }}>{stats.words} words</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>Est. Read Time</span>
                    <span style={{ color: '#fff' }}>~{stats.readTime} min</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>Structure</span>
                    <span style={{ color: stats.headings >= 2 ? '#4CAF50' : '#FFC107' }}>
                        {stats.headings} headings
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '1px' }}>Ref Links</span>
                    <span style={{ color: stats.links > 0 ? '#4CAF50' : '#888' }}>{stats.links} links</span>
                </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ marginTop: '1.25rem', background: '#111', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${stats.score}%`,
                    background: scoreColor,
                    transition: 'width 0.4s ease, background 0.4s ease'
                }} />
            </div>

            <p style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.75rem', lineHeight: 1.5 }}>
                Aim for a score above 80. Use <strong>H2/H3 headings</strong>, write at least 300 words, and add reference links.
            </p>
        </div>
    );
}
