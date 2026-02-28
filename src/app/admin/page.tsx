'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Dashboard</h1>
                <p className={styles.pageSub}>Welcome back, Muthuraj. Here&apos;s your store overview.</p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard label="Total Orders" value={loading ? '...' : (stats?.stats?.totalOrders ?? 0)} icon="📋" color="#f5a623" />
                <StatCard label="Total Revenue" value={loading ? '...' : `₹${(stats?.stats?.totalRevenue ?? 0).toFixed(0)}`} icon="💰" color="#4CAF50" />
                <StatCard label="Pending Reviews" value={loading ? '...' : (stats?.stats?.pendingReviews ?? 0)} icon="⭐" color="#2196F3" />
                <StatCard label="Active Licenses" value={loading ? '...' : (stats?.stats?.totalUsers ?? 0)} icon="🔑" color="#9C27B0" />
            </div>

            <div className={styles.recentSection}>
                <h2 className={styles.sectionTitle}>Recent Orders</h2>
                <div className={styles.table}>
                    <div className={`${styles.tableRow} ${styles.tableHead}`}>
                        <span>Order ID</span>
                        <span>Amount</span>
                        <span>Status</span>
                        <span>Date</span>
                    </div>
                    {loading ? (
                        <div className={styles.emptyState}>Loading...</div>
                    ) : stats?.recentOrders?.length === 0 ? (
                        <div className={styles.emptyState}>No orders yet. Orders will appear here after first purchase.</div>
                    ) : stats?.recentOrders?.map((o: any) => (
                        <div key={o.id} className={styles.tableRow}>
                            <span className={styles.mono}>{o.id?.slice(0, 8)}...</span>
                            <span>₹{o.amount}</span>
                            <span className={`${styles.badge} ${styles[`badge_${o.status}`]}`}>{o.status}</span>
                            <span className={styles.muted}>{new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) {
    return (
        <div className={styles.statCard} style={{ borderTop: `2px solid ${color}` }}>
            <div className={styles.statIcon}>{icon}</div>
            <div className={styles.statValue}>{value}</div>
            <div className={styles.statLabel}>{label}</div>
        </div>
    );
}
