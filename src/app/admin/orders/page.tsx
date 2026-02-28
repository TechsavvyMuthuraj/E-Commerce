'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '../page.module.css';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [items, setItems] = useState<Record<string, any[]>>({});

    useEffect(() => {
        supabase.from('orders').select('*').order('created_at', { ascending: false })
            .then(({ data }) => { setOrders(data || []); setLoading(false); });
    }, []);

    const loadItems = async (orderId: string) => {
        if (items[orderId]) { setExpanded(expanded === orderId ? null : orderId); return; }
        const { data } = await supabase.from('order_items').select('*').eq('order_id', orderId);
        setItems(prev => ({ ...prev, [orderId]: data || [] }));
        setExpanded(orderId);
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Orders</h1>
                <p className={styles.pageSub}>View all customer orders recorded after successful payment verification.</p>
            </div>

            {loading ? (
                <div className={styles.emptyState}>Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className={styles.emptyState}>No orders yet. Complete a checkout to see orders here.</div>
            ) : (
                <div className={styles.table}>
                    <div className={`${styles.tableRow} ${styles.tableHead}`} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto' }}>
                        <span>Order ID</span><span>User</span><span>Amount</span><span>Status</span><span>Date</span>
                    </div>
                    {orders.map(order => (
                        <>
                            <div
                                key={order.id}
                                className={styles.tableRow}
                                style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', cursor: 'pointer' }}
                                onClick={() => loadItems(order.id)}
                            >
                                <span className={styles.mono}>{order.id?.slice(0, 16)}...</span>
                                <span className={styles.muted}>{order.user_id?.slice(0, 8)}...</span>
                                <span>₹{order.amount}</span>
                                <span className={`${styles.badge} ${styles[`badge_${order.status}`]}`}>{order.status}</span>
                                <span className={styles.muted}>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            {expanded === order.id && items[order.id] && (
                                <div style={{ background: '#0d0d0f', borderBottom: '1px solid #1a1a1a', padding: '0.75rem 1.25rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#555', fontFamily: 'var(--font-heading)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Order Items</div>
                                    {items[order.id].length === 0 ? (
                                        <span style={{ color: '#444', fontSize: '0.85rem' }}>No items found</span>
                                    ) : items[order.id].map((item: any) => (
                                        <div key={item.id} style={{ display: 'flex', gap: '2rem', fontSize: '0.85rem', color: '#888', padding: '0.3rem 0' }}>
                                            <span>{item.product_id}</span>
                                            <span>₹{item.price}</span>
                                            <span style={{ color: '#555' }}>{item.license_type}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ))}
                </div>
            )}
        </div>
    );
}
