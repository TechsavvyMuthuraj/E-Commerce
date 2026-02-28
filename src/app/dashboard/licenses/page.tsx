'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface OrderItem {
    id: string; // The specific license UUID mapped to user's order
    product_slug: string;
    license_tier: string;
    created_at: string;
}

// Mock fallback incase Supabase is unconfigured / empty
const mockLicenses = [
    { id: 'LIC-A1B2C3D4', productTitle: 'Nexus Engine Pro', tier: 'COMMERCIAL', issueDate: '2026-02-15', expires: 'Never' },
    { id: 'LIC-E5F6G7H8', productTitle: 'Quantum UI Kit', tier: 'PERSONAL', issueDate: '2026-02-10', expires: 'Never' },
    { id: 'LIC-I9J0K1L2', productTitle: 'Strata Dashboard', tier: 'TEAM', issueDate: '2026-01-05', expires: 'Never' },
];

export default function LicensesPage() {
    const [licenses, setLicenses] = useState<any[]>(mockLicenses);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchLicenses() {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch completed order_items for this user (each item = 1 license)
                    const { data, error } = await supabase
                        .from('order_items')
                        .select(`
                            id,
                            product_slug,
                            license_tier,
                            orders!inner(status, user_id, created_at)
                        `)
                        .eq('orders.user_id', session.user.id)
                        .eq('orders.status', 'completed');

                    if (error) throw error;

                    if (data && isMounted) {
                        // Sort descending by order's created_at date
                        const sortedData = data.sort((a: any, b: any) =>
                            new Date(b.orders.created_at).getTime() - new Date(a.orders.created_at).getTime()
                        );

                        const mappedLicenses = sortedData.map((item: any) => ({
                            // Generate short hash-like id from uuid for UI display
                            id: `LIC-${item.id.split('-')[0].toUpperCase()}`,
                            productTitle: item.product_slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
                            tier: item.license_tier.toUpperCase(),
                            issueDate: new Date(item.orders.created_at).toISOString().split('T')[0],
                            expires: 'Never' // Perpetual licenses
                        }));
                        setLicenses(mappedLicenses);
                    }
                }
            } catch (err) {
                console.error("Supabase license fetch failed, defaulting to mock data:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchLicenses();

        // Setup real-time postgres subscriptions for this user's data
        const channel = supabase.channel('licenses_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchLicenses();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
                fetchLicenses();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDownload = (id: string) => {
        setDownloadingId(id);
        // Simulate Supabase Storage Signed URL generation
        setTimeout(() => {
            const license = licenses.find(l => l.id === id);
            const content = `LICENSE KEY: ${id}\nPRODUCT: ${license?.productTitle}\nTIER: ${license?.tier}\n\nThis is a mocked downloaded asset file triggered from a Supabase row.`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${license?.productTitle?.replace(/\s+/g, '-').toLowerCase()}-assets.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            setDownloadingId(null);
        }, 1500);
    };

    return (
        <div className={styles.licensesView}>
            <header className={styles.pageHeader}>
                <h1>My Licenses</h1>
                <p className={styles.subtitle}>Active software keys and secure downloads.</p>
            </header>

            <div className={styles.licensesGrid}>
                {isLoading ? (
                    <div style={{ color: 'var(--muted)', padding: '2rem' }}>Decrypting active license keys...</div>
                ) : licenses.length === 0 ? (
                    <div style={{ color: 'var(--muted)', padding: '2rem' }}>No active licenses found.</div>
                ) : (
                    licenses.map(license => (
                        <div key={license.id} className={styles.licenseCard}>
                            <div className={styles.licenseHeader}>
                                <h3 className={styles.productTitle}>{license.productTitle}</h3>
                                <span className={styles.tierBadge}>{license.tier}</span>
                            </div>

                            <div className={styles.keyBox}>
                                <div className={styles.keyLabel}>License Key</div>
                                <div className={styles.keyRow}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={license.id}
                                        className={`pricing-code ${styles.keyInput}`}
                                    />
                                    <button
                                        className={`btn-secondary ${styles.copyBtn}`}
                                        onClick={() => handleCopy(license.id)}
                                    >
                                        {copiedId === license.id ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.metaInfo}>
                                <div className={styles.metaCol}>
                                    <span>Issued</span>
                                    <span>{license.issueDate}</span>
                                </div>
                                <div className={styles.metaCol}>
                                    <span>Expires</span>
                                    <span>{license.expires}</span>
                                </div>
                            </div>

                            <button
                                className={`btn-primary ${styles.downloadBtn}`}
                                onClick={() => handleDownload(license.id)}
                                disabled={downloadingId === license.id}
                            >
                                <span className={styles.dlIcon}>↓</span>
                                {downloadingId === license.id ? 'Generating Secure Link...' : 'Download Assets'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
