'use client';
import { useState, useEffect } from 'react';
import styles from '../page.module.css';

interface StoredLink {
    _id: string;
    title: string;
    amount: number;
    url: string;
    _createdAt: string;
}

export default function PayLinkStore() {
    const [links, setLinks] = useState<StoredLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [url, setUrl] = useState('');
    const [msg, setMsg] = useState('');

    const loadLinks = () => {
        setLoading(true);
        fetch('/api/admin/sanity?type=storedLink')
            .then(r => r.json())
            .then(d => { setLinks(d.documents || []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { loadLinks(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true); setMsg('');

        const doc = {
            _type: 'storedLink',
            title,
            amount: Number(amount),
            url
        };

        const res = await fetch('/api/admin/sanity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ document: doc })
        });

        const data = await res.json();
        if (data.success) {
            setMsg('✓ Payment Link stored successfully!');
            setTitle(''); setAmount(''); setUrl('');
            loadLinks();
        } else {
            setMsg('Error saving link: ' + JSON.stringify(data.error));
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        await fetch('/api/admin/sanity', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadLinks();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Payment Links Store</h1>
                <p className={styles.pageSub}>Save and manage Razorpay payment links for quick access and distribution.</p>
            </div>

            <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Add New Link</h2>
                <form onSubmit={handleSave} className={styles.fieldset}>
                    <div className={styles.fieldRow}>
                        <div className={styles.field}>
                            <label>Product / Label Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Windows Optimizer (Lifetime)"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Amount (₹)</label>
                            <input
                                type="number"
                                required
                                placeholder="e.g. 500"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>Razorpay Payment URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://rzp.io/..."
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            style={{ fontFamily: 'monospace' }}
                        />
                    </div>

                    {msg && <div style={{ color: msg.startsWith('✓') ? '#4CAF50' : '#f44336', fontSize: '0.85rem', marginTop: '0.5rem' }}>{msg}</div>}

                    <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '1.5rem', width: 'auto', padding: '0.75rem 2rem' }}>
                        {saving ? 'Saving...' : 'Save Payment Link'}
                    </button>
                </form>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <div className={styles.toolbarRow}>
                    <h2 className={styles.sectionTitle}>Stored Links ({links.length})</h2>
                    <button className="btn-secondary" onClick={loadLinks} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Refresh</button>
                </div>

                {loading ? <div className={styles.emptyState}>Loading...</div> : links.length === 0 ? (
                    <div className={styles.emptyState}>No links stored yet.</div>
                ) : (
                    <div className={styles.table}>
                        <div className={`${styles.tableRow} ${styles.tableHead} ${styles.docRow}`} style={{ gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr' }}>
                            <span>Label</span><span>Amount</span><span>URL</span><span>Created</span><span>Actions</span>
                        </div>
                        {links.map(link => (
                            <div key={link._id} className={`${styles.tableRow} ${styles.docRow}`} style={{ gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>{link.title}</span>
                                <span className={`pricing-code ${styles.accent}`}>₹{link.amount || 0}</span>
                                <span className={styles.mono} style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {link.url}
                                </span>
                                <span className={styles.muted} style={{ fontSize: '0.85rem' }}>
                                    {new Date(link._createdAt).toLocaleDateString()}
                                </span>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <button className={styles.approveBtn} onClick={() => copyToClipboard(link.url)}>Copy</button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(link._id, link.title)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
