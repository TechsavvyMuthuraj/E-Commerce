'use client';
import { useState } from 'react';
import styles from '../page.module.css';

export default function EmailBlastTool() {
    const [segment, setSegment] = useState('all');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState('');

    const handleSend = async () => {
        if (!subject || !body) {
            setMessage('⚠ Subject and Body are required.');
            return;
        }

        if (!confirm(`Are you sure you want to blast this email to the '${segment}' segment?`)) return;

        setSending(true);
        setMessage('');

        try {
            const res = await fetch('/api/admin/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ segment, subject, body })
            });
            const data = await res.json();

            if (data.success) {
                setMessage(`✅ ${data.message}`);
                setSubject('');
                setBody('');
            } else {
                setMessage(`⚠ Error: ${data.error}`);
            }
        } catch (e: any) {
            setMessage(`⚠ Network Error: ${e.message}`);
        }

        setSending(false);
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Email Blast</h1>
                <p className={styles.pageSub}>Compose and dispatch bulk marketing campaigns directly to your user segments.</p>
            </div>

            <div style={{ background: '#0a0a0c', border: '1px solid #222', borderRadius: '8px', padding: '2rem', marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Segment Selector */}
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Target Audience Segment</label>
                    <select
                        value={segment}
                        onChange={e => setSegment(e.target.value)}
                        style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '0.8rem 1rem', borderRadius: '4px', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="all">🌍 All Registered Users (1,432)</option>
                        <option value="buyers">💰 Premium Buyers Only (421)</option>
                        <option value="churned">💤 Churned / Inactive (189)</option>
                        <option value="vip">✨ VIP High Spenders (42)</option>
                    </select>
                </div>

                {/* Subject Line */}
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Subject Line</label>
                    <input
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. ⚡ Massive Update: Version 2.0 is Live!"
                        style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '0.8rem 1rem', borderRadius: '4px', fontFamily: 'var(--font-sans)', fontSize: '1rem', outline: 'none' }}
                    />
                </div>

                {/* Email Body */}
                <div>
                    <label style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Body (HTML / Markdown)</label>
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        placeholder="Write your email here... support for basic HTML tags included."
                        style={{ width: '100%', height: '300px', background: '#111', border: '1px solid #333', color: '#e0e0e0', padding: '1rem', borderRadius: '4px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
                    />
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: '1.5rem', marginTop: '0.5rem' }}>

                    <span style={{ color: message.includes('✅') ? '#4CAF50' : '#ff5f56', fontSize: '0.9rem', fontWeight: 600 }}>
                        {message}
                    </span>

                    <button
                        onClick={handleSend}
                        disabled={sending}
                        style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '0.8rem 2rem', borderRadius: '4px', fontWeight: 700, cursor: sending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-heading)', letterSpacing: '1px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: sending ? 0.7 : 1 }}
                    >
                        {sending ? 'DISPATCHING...' : '🚀 SEND CAMPAIGN'}
                    </button>
                </div>

            </div>
        </div>
    );
}
