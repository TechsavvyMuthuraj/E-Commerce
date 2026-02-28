'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './Navbar.module.css';

export default function Navbar() {
    const items = useCartStore((state) => state.items);
    const toggleDrawer = useCartStore((state) => state.toggleDrawer);
    const [mounted, setMounted] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setMounted(true);

        supabase.auth.getSession().then(({ data: { session } }: any) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    EXE<span className={styles.accent}> TOOL</span>
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/products" className={styles.navLink}>All Tools</Link>
                    <Link href="/category/optimization" className={styles.navLink}>Optimization</Link>
                    <Link href="/category/debloat" className={styles.navLink}>Debloat</Link>
                    <Link href="/blog" className={styles.navLink}>Blog</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                </div>
                <div className={styles.navActions}>
                    <button className={styles.cartBtn} onClick={toggleDrawer}>
                        Cart ({mounted ? items.length : 0})
                    </button>
                    {user ? (
                        <Link href="/dashboard" className={`btn-primary ${styles.profileBtn}`}>
                            <span className={styles.avatarIcon}>⚙</span> {user.email?.split('@')[0]}
                        </Link>
                    ) : (
                        <Link href="/login" className="btn-primary">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
