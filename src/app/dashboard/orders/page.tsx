'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

interface OrderLineItem {
    id: string;
    product_slug: string;
}

interface Order {
    id: string;
    created_at: string;
    amount: number;
    status: string;
    order_items: OrderLineItem[];
}

// Fallback mock data in case Supabase is empty or unconfigured
const mockOrders = [
    { id: 'ORD-X98V4A', date: '2026-02-15', total: 198, items: 2, status: 'COMPLETED' },
    { id: 'ORD-M76C2B', date: '2026-02-10', total: 79, items: 1, status: 'COMPLETED' },
    { id: 'ORD-P44K9T', date: '2026-01-05', total: 499, items: 1, status: 'FAILED' },
];

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>(mockOrders);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchOrders() {
            try {
                // Fetch the current user session
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch real orders matching this user ID, joining order_items to get item counts
                    const { data, error } = await supabase
                        .from('orders')
                        .select(`
                            id, 
                            created_at, 
                            amount, 
                            status,
                            order_items ( id, product_slug )
                        `)
                        .eq('user_id', session.user.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    if (data && isMounted) {
                        // Map the raw Postgres arrays into our UI format
                        const mappedOrders = data.map((order: Order) => ({
                            id: order.id.split('-')[0].toUpperCase(), // Shorten UUID for display
                            date: new Date(order.created_at).toISOString().split('T')[0],
                            total: order.amount,
                            items: order.order_items?.length || 0,
                            status: order.status.toUpperCase()
                        }));
                        setOrders(mappedOrders);
                    }
                }
            } catch (err) {
                console.error("Supabase fetch failed, defaulting to mock data:", err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        fetchOrders();

        // Setup real-time postgres subscriptions for this user's data
        const channel = supabase.channel('orders_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            isMounted = false;
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className={styles.ordersView}>
            <header className={styles.pageHeader}>
                <h1>Order History</h1>
                <p className={styles.subtitle}>Review past transactions and invoices.</p>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.ordersTable}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>Connecting to secure database...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.emptyState}>No orders found.</td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id}>
                                    <td className={`pricing-code ${styles.orderId}`}>{order.id}</td>
                                    <td>{order.date}</td>
                                    <td>{order.items}</td>
                                    <td className={`pricing-code ${styles.total}`}>${order.total}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || styles.pending}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Link href={`/dashboard/orders/${order.id}`} className={styles.viewLink}>
                                            View Invoice
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
