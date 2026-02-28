'use client';
import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import { useModal } from '@/components/ui/PremiumModal';

interface License {
    id: string;
    user_id: string;
    product_id: string;
    order_id: string;
    license_key: string;
    license_tier: string;
    created_at: string;
    status?: string;
}

export default function LicenseManager() {
    const [licenses, setLicenses] = useState<License[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const { confirm } = useModal();

    const [newProductId, setNewProductId] = useState('bundle-pro');
    const [newTier, setNewTier] = useState('tier1');

    useEffect(() => {
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const res = await fetch('/api/admin/licenses');
            const data = await res.json();
            if (data.success) {
                setLicenses(data.licenses);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleGenerate = async () => {
        confirm({
            title: 'Generate License Key?',
            message: `Issue a new manual license key for product "${newProductId}" — Tier: ${newTier}.`,
            confirmLabel: 'Generate',
            variant: 'warning',
            onConfirm: async () => {
                setGenerating(true);
                try {
                    const res = await fetch('/api/admin/licenses', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: 'manual-admin-gen', productId: newProductId, tier: newTier })
                    });
                    const data = await res.json();
                    if (data.success) fetchLicenses();
                } catch (e) { console.error(e); }
                setGenerating(false);
            }
        });
    };

    const handleRevoke = async (id: string) => {
        confirm({
            title: 'Revoke License Key?',
            message: 'WARNING: This will permanently revoke the license. The customer will lose access immediately.',
            confirmLabel: 'Revoke',
            variant: 'danger',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/licenses?id=${id}`, { method: 'DELETE' });
                    const data = await res.json();
                    if (data.success) setLicenses(prev => prev.filter(l => l.id !== id));
                } catch (e) { console.error(e); }
            }
        });
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>License Manager</h1>
                <p className={styles.pageSub}>Generate, track, and revoke access keys across your platform.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '2rem', marginTop: '2rem' }}>

                {/* Manual Generator */}
                <div style={{ background: '#0a0a0c', border: '1px solid #222', borderRadius: '8px', padding: '1.5rem', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                    <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🔑 Generate Key
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Product ID</label>
                            <input
                                value={newProductId}
                                onChange={e => setNewProductId(e.target.value)}
                                style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '0.6rem 1rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>Tier</label>
                            <select
                                value={newTier}
                                onChange={e => setNewTier(e.target.value)}
                                style={{ width: '100%', background: '#111', border: '1px solid #333', color: '#fff', padding: '0.6rem 1rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', appearance: 'none' }}
                            >
                                <option value="tier1">Tier 1 (Standard)</option>
                                <option value="tier2">Tier 2 (Pro)</option>
                                <option value="tier3">Tier 3 (Enterprise)</option>
                            </select>
                        </div>

                        <button onClick={handleGenerate} disabled={generating} style={{ background: 'var(--accent)', color: '#000', border: 'none', padding: '0.75rem 1rem', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
                            {generating ? 'Generating...' : '+ Issue New Key'}
                        </button>
                    </div>
                </div>

                {/* License Table */}
                <div className={styles.recentSection} style={{ marginTop: 0 }}>
                    <h2 className={styles.sectionTitle}>Active Licenses ({licenses.length})</h2>
                    <div className={styles.table}>
                        <div className={`${styles.tableRow} ${styles.tableHead}`} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr' }}>
                            <span>License Key</span>
                            <span>Product</span>
                            <span>Created</span>
                            <span>User ID / Order</span>
                            <span>Action</span>
                        </div>
                        {loading ? (
                            <div className={styles.emptyState}>Loading keys...</div>
                        ) : licenses.length === 0 ? (
                            <div className={styles.emptyState}>No licenses generated yet.</div>
                        ) : licenses.map((l: License) => (
                            <div key={l.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.5fr', alignItems: 'center' }}>
                                <span className={styles.mono} style={{ color: 'var(--accent)' }}>{l.license_key}</span>
                                <span style={{ fontSize: '0.85rem' }}>{l.product_id} <span className={styles.muted}>({l.license_tier})</span></span>
                                <span className={styles.muted}>{new Date(l.created_at).toLocaleDateString()}</span>
                                <span className={styles.mono} style={{ fontSize: '0.75rem', color: '#888' }}>
                                    {l.user_id?.split('-')[0]} / {l.order_id?.split('-')[0]}
                                </span>
                                <div>
                                    <button onClick={() => handleRevoke(l.id)} style={{ background: 'transparent', border: '1px solid #ff5f56', color: '#ff5f56', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                                        REVOKE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
