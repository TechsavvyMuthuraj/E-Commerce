'use client';
import { useEffect, useState } from 'react';
import styles from '../page.module.css';

interface UserData {
    userId: string;
    email: string;
    provider: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: string;
    status: string;
}

function ProviderBadge({ provider }: { provider: string }) {
    const p = provider?.toLowerCase();
    const cfg: Record<string, { label: string; bg: string; color: string; icon: string }> = {
        google: { label: 'Google', bg: 'rgba(66,133,244,0.12)', color: '#4285F4', icon: '🔵' },
        email: { label: 'Email', bg: 'rgba(245,166,35,0.10)', color: 'var(--accent)', icon: '✉️' },
        github: { label: 'GitHub', bg: 'rgba(200,200,200,0.10)', color: '#ccc', icon: '🐙' },
    };
    const c = cfg[p] || { label: p || 'Unknown', bg: '#222', color: '#888', icon: '🔐' };
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px',
            background: c.bg, color: c.color, border: `1px solid ${c.color}33`,
            padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem',
            fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px'
        }}>
            {c.icon} {c.label}
        </span>
    );
}

function ViewModal({ user, onClose }: { user: UserData; onClose: () => void }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }} onClick={onClose}>
            <div style={{
                background: '#0d0d0d', border: '1px solid var(--border)', maxWidth: '500px',
                width: '100%', borderRadius: '8px', overflow: 'hidden'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ borderBottom: '1px solid var(--border)', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
                        👤 User Profile
                    </span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                    {/* Avatar + Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '50%',
                            background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.4rem', fontWeight: 700, color: '#000', flexShrink: 0
                        }}>
                            {(user.email[0] || '?').toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>{user.email}</div>
                            <div style={{ fontSize: '0.72rem', color: '#555', fontFamily: 'monospace', marginTop: '3px' }}>{user.userId}</div>
                        </div>
                    </div>

                    {/* Details grid */}
                    {[
                        {
                            label: 'Login Method',
                            value: <ProviderBadge provider={user.provider} />
                        },
                        {
                            label: 'Account Status',
                            value: (
                                <span style={{ color: user.status.toLowerCase() === 'banned' ? '#ff5f56' : '#4CAF50', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                    ● {user.status}
                                </span>
                            )
                        },
                        { label: 'Total Spent', value: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{user.totalSpent}</span> },
                        { label: 'Total Orders', value: <span style={{ color: '#fff' }}>{user.orderCount}</span> },
                        { label: 'Last Active', value: <span style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '0.85rem' }}>{new Date(user.lastOrderDate).toLocaleString()}</span> },
                        { label: 'User ID', value: <code style={{ color: '#888', fontSize: '0.7rem', wordBreak: 'break-all' }}>{user.userId}</code> },
                    ].map(({ label, value }) => (
                        <div key={label} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: '0.5rem', padding: '0.7rem 0', borderBottom: '1px solid #1a1a1a' }}>
                            <span style={{ color: '#555', fontSize: '0.8rem', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'center' }}>{label}</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>

                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
                    <button onClick={onClose} style={{ background: '#222', color: '#fff', border: '1px solid #333', padding: '0.5rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);
    const [viewUser, setViewUser] = useState<UserData | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.status === 403) {
                const data = await res.json();
                setAuthErrorMsg(data.error);
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.success) setUsers(data.users);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleStatusChange = async (userId: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to ${newStatus} this user?`)) return;
        setUsers(prev => prev.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
        await fetch('/api/admin/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, status: newStatus })
        });
    };

    const handleDelete = async (user: UserData) => {
        if (!confirm(`⚠️ Permanently delete "${user.email}"? This cannot be undone and removes them from Supabase Auth.`)) return;
        const res = await fetch('/api/admin/users', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.userId })
        });
        const data = await res.json();
        if (data.success) {
            setUsers(prev => prev.filter(u => u.userId !== user.userId));
        } else {
            alert('Delete failed: ' + data.error);
        }
    };

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.userId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            {viewUser && <ViewModal user={viewUser} onClose={() => setViewUser(null)} />}

            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>User Directory</h1>
                <p className={styles.pageSub}>Manage your customers, view total spend, and control access.</p>
            </div>

            <div className={styles.recentSection} style={{ marginTop: '2.5rem' }}>

                {authErrorMsg && (
                    <div style={{ background: 'rgba(255, 170, 0, 0.1)', borderLeft: '4px solid var(--accent)', padding: '1rem', marginBottom: '2rem', borderRadius: '4px' }}>
                        <h3 style={{ color: 'var(--accent)', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>⚠️</span> Configuration Missing
                        </h3>
                        <p style={{ color: '#ddd', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                            {authErrorMsg} <br /><br />
                            <strong>How to fix:</strong><br />
                            1. Go to your Supabase Dashboard -&gt; Project Settings -&gt; API.<br />
                            2. Copy the <code>service_role</code> secret key.<br />
                            3. Add <code>SUPABASE_SERVICE_ROLE_KEY=your_key_here</code> to your <code>.env.local</code> file.<br />
                            4. Restart your terminal (<code>npm run dev</code>).
                        </p>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Registered Customers ({filtered.length})</h2>
                    <input
                        type="text"
                        placeholder="Search by email or UUID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ padding: '0.5rem 1rem', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', width: '260px' }}
                    />
                </div>

                <div className={styles.table}>
                    <div className={`${styles.tableRow} ${styles.tableHead}`} style={{ gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1.8fr' }}>
                        <span>Customer Identity</span>
                        <span>Provider</span>
                        <span>Spent</span>
                        <span>Orders</span>
                        <span>Last Active</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (
                        <div className={styles.emptyState}>Loading CRM data...</div>
                    ) : filtered.length === 0 ? (
                        <div className={styles.emptyState}>No customers found yet.</div>
                    ) : filtered.map((u: UserData) => (
                        <div key={u.userId} className={styles.tableRow} style={{ gridTemplateColumns: '1.8fr 0.8fr 0.8fr 1fr 1fr 1.8fr', alignItems: 'center' }}>
                            {/* Identity */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem', wordBreak: 'break-all' }}>{u.email}</span>
                                <span className={styles.mono} style={{ fontSize: '0.65rem', color: '#555' }}>
                                    {u.userId.split('-')[0]}...{u.userId.split('-').pop()}
                                </span>
                                <span style={{ fontSize: '0.65rem', color: u.status.toLowerCase() === 'banned' ? '#ff5f56' : '#4CAF50', fontWeight: 700, textTransform: 'uppercase' }}>
                                    ● {u.status}
                                </span>
                            </div>

                            {/* Provider */}
                            <div><ProviderBadge provider={u.provider} /></div>

                            {/* Spend */}
                            <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '0.9rem' }}>₹{u.totalSpent}</span>

                            {/* Orders */}
                            <span style={{ color: '#ddd' }}>{u.orderCount}</span>

                            {/* Last Active */}
                            <span className={styles.muted} style={{ fontSize: '0.8rem' }}>{new Date(u.lastOrderDate).toLocaleDateString()}</span>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                {/* View */}
                                <button
                                    onClick={() => setViewUser(u)}
                                    style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--accent)', border: '1px solid rgba(245,166,35,0.3)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                                >
                                    View
                                </button>

                                {/* Warn */}
                                <button
                                    onClick={() => handleStatusChange(u.userId, 'Warned')}
                                    style={{ background: '#2a2a2a', color: '#ccc', border: '1px solid #333', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                    Warn
                                </button>

                                {/* Ban / Unban */}
                                {u.status.toLowerCase() === 'banned' ? (
                                    <button
                                        onClick={() => handleStatusChange(u.userId, 'Active')}
                                        style={{ background: 'rgba(76,175,80,0.1)', color: '#4CAF50', border: '1px solid #4CAF50', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Unban
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStatusChange(u.userId, 'Banned')}
                                        style={{ background: 'rgba(255,95,86,0.08)', color: '#ff5f56', border: '1px solid #ff5f56', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Ban
                                    </button>
                                )}

                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(u)}
                                    title="Permanently delete this user from Supabase Auth"
                                    style={{ background: 'rgba(255,50,50,0.08)', color: '#ff3232', border: '1px solid rgba(255,50,50,0.3)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', cursor: 'pointer' }}
                                >
                                    🗑
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
