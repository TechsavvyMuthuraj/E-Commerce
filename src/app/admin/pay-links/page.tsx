'use client';
import { useState } from 'react';
import styles from '../page.module.css';

export default function PayLinkGenerator() {
    const [amount, setAmount] = useState('');
    const [label, setLabel] = useState('Custom Software Order');
    const [generatedLink, setGeneratedLink] = useState('');

    const generate = () => {
        if (!amount || Number(amount) <= 0) return;

        // Base URL — in prod this should use the real domain
        // We'll use window.location.origin to make it dynamic
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/pay/custom?amount=${amount}&label=${encodeURIComponent(label)}`;
        setGeneratedLink(url);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        alert('Link copied to clipboard!');
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Payment Link Generator</h1>
                <p className={styles.pageSub}>Create a custom checkout link with a specific amount to send to your customers.</p>
            </div>

            <div className={styles.formCard} style={{ maxWidth: '600px' }}>
                <div className={styles.fieldset}>
                    <div className={styles.field}>
                        <label>Amount (₹)</label>
                        <input
                            type="number"
                            placeholder="e.g. 500"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Order Label / Description</label>
                        <input
                            type="text"
                            placeholder="e.g. Bulk License Pack"
                            value={label}
                            onChange={e => setLabel(e.target.value)}
                        />
                    </div>

                    <button className="btn-primary" onClick={generate} style={{ marginTop: '1rem' }}>
                        Generate Link
                    </button>

                    {generatedLink && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#0a0a0c', border: '1px dashed #333' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Your Custom Link</div>
                            <div style={{
                                wordBreak: 'break-all',
                                padding: '1rem',
                                background: '#111',
                                border: '1px solid #222',
                                fontFamily: 'monospace',
                                color: '#888',
                                fontSize: '0.9rem',
                                marginBottom: '1rem'
                            }}>
                                {generatedLink}
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn-secondary" onClick={copyToClipboard}>Copy Link</button>
                                <a href={generatedLink} target="_blank" className="btn-secondary" style={{ textDecoration: 'none' }}>Open Link ↗</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '3rem', color: '#555', fontSize: '0.9rem' }}>
                <h3 style={{ color: '#888', marginBottom: '1rem' }}>How it works:</h3>
                <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>You set a custom amount and a friendly label.</li>
                    <li>The system generates a secure link to the EXE TOOL checkout.</li>
                    <li>When the customer opens the link, the payment modal pops up immediately for that amount.</li>
                    <li>After payment, they are redirected to the standard success page.</li>
                </ol>
            </div>
        </div>
    );
}
