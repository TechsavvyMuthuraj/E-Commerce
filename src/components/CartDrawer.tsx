'use client';

import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './CartDrawer.module.css';

export default function CartDrawer() {
    const { items, isDrawerOpen, closeDrawer, removeItem, getCartTotal } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {isDrawerOpen && <div className={styles.backdrop} onClick={closeDrawer} />}
            <div className={`${styles.drawer} ${isDrawerOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Your Cart</h2>
                    <button className={styles.closeBtn} onClick={closeDrawer}>✕</button>
                </div>

                <div className={styles.content}>
                    {items.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Your cart is empty.</p>
                            <button className="btn-secondary" onClick={closeDrawer}>Continue Shopping</button>
                        </div>
                    ) : (
                        <div className={styles.itemsList}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.cartItem}>
                                    <div className={styles.itemImage} style={{ background: item.image }}></div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemHeader}>
                                            <h4>{item.title}</h4>
                                            <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove</button>
                                        </div>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.tierBadge}>{item.licenseTier}</span>
                                            <span className={`pricing-code ${styles.price}`}>₹{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span className={`pricing-code ${styles.totalPrice}`}>₹{getCartTotal()}</span>
                        </div>
                        <Link href="/checkout" className={`btn-primary ${styles.checkoutBtn}`} onClick={closeDrawer}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
