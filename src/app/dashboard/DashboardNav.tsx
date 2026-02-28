'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';

export default function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className={styles.navConfig}>
            <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
                <span className={styles.icon}>⚡</span> Overview
            </Link>
            <Link href="/dashboard/licenses" className={`${styles.navItem} ${pathname?.includes('/dashboard/licenses') ? styles.active : ''}`}>
                <span className={styles.icon}>🔑</span> My Licenses
            </Link>
            <Link href="/dashboard/orders" className={`${styles.navItem} ${pathname?.includes('/dashboard/orders') ? styles.active : ''}`}>
                <span className={styles.icon}>📦</span> Order History
            </Link>
            <Link href="/dashboard/wishlist" className={`${styles.navItem} ${pathname?.includes('/dashboard/wishlist') ? styles.active : ''}`}>
                <span className={styles.icon}>★</span> Wishlist
            </Link>
        </nav>
    );
}
