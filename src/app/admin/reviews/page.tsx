'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '../page.module.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

    const load = () => {
        setLoading(true);
        const query = supabase.from('product_reviews').select('*').order('created_at', { ascending: false });
        (filter !== 'all' ? query.eq('status', filter) : query)
            .then(({ data }) => { setReviews(data || []); setLoading(false); });
    };

    useEffect(() => { load(); }, [filter]);

    const updateStatus = async (id: string, status: string) => {
        await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
        load();
    };

    const deleteReview = async (id: string) => {
        if (!confirm('Permanently delete this review?')) return;
        await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        load();
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Reviews</h1>
                <p className={styles.pageSub}>Moderate customer reviews. Only approved reviews appear on product pages.</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.4rem 1rem',
                            background: filter === f ? 'var(--accent)' : 'transparent',
                            border: '1px solid',
                            borderColor: filter === f ? 'var(--accent)' : '#333',
                            color: filter === f ? '#000' : '#888',
                            fontFamily: 'var(--font-heading)',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '1px',
                            cursor: 'pointer',
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className={styles.emptyState}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className={styles.emptyState}>No {filter !== 'all' ? filter : ''} reviews found.</div>
            ) : (
                <div className={styles.itemList}>
                    {reviews.map(r => (
                        <div key={r.id} className={styles.itemRow} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <div>
                                    <span className={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    <span style={{ marginLeft: '0.75rem', fontWeight: 600 }}>{r.title}</span>
                                    {r.is_verified_purchase && <span style={{ marginLeft: '0.75rem', color: '#4CAF50', fontSize: '0.75rem' }}>✓ Verified</span>}
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className={`${styles.badge} ${styles[`badge_${r.status}`]}`}>{r.status}</span>
                                    {r.status !== 'approved' && <button className={styles.approveBtn} onClick={() => updateStatus(r.id, 'approved')}>Approve</button>}
                                    {r.status !== 'rejected' && <button className={styles.rejectBtn} onClick={() => updateStatus(r.id, 'rejected')}>Reject</button>}
                                    <button className={styles.deleteBtn} onClick={() => deleteReview(r.id)}>Delete</button>
                                </div>
                            </div>
                            <p style={{ color: '#888', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{r.body}</p>
                            <div style={{ fontSize: '0.75rem', color: '#444' }}>
                                Product: <span style={{ color: '#666' }}>{r.product_id}</span> · {new Date(r.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
