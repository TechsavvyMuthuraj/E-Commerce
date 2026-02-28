'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function OrderSuccessPage() {
    const [ticketId, setTicketId] = useState('');

    useEffect(() => {
        // Generate mock order ID
        setTicketId(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.successCard}>
                <div className={styles.icon}>✓</div>
                <h1 className={styles.title}>Payment Successful</h1>
                <p className={styles.message}>
                    Your transaction was completed and your license keys have been generated.
                </p>

                <div className={styles.orderDetails}>
                    <div className={styles.detailRow}>
                        <span>Order Reference</span>
                        <span className={`pricing-code ${styles.accent}`}>{ticketId}</span>
                    </div>
                    <div className={styles.detailRow}>
                        <span>Status</span>
                        <span className={styles.status}>FULFILLED</span>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link href="/dashboard/licenses" className={`btn-primary ${styles.btn}`}>
                        View Licenses
                    </Link>
                    <Link href="/products" className={`btn-secondary ${styles.btn}`}>
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
