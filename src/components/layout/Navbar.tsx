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
    const [menuOpen, setMenuOpen] = useState(false);

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

    // Close menu on route change or ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={`container ${styles.navContainer}`}>
                    <Link href="/" className={styles.logo} onClick={closeMenu}>
                        EXE<span className={styles.accent}> TOOL</span>
                    </Link>

                    {/* Desktop nav links */}
                    <div className={styles.navLinks}>
                        <Link href="/products" className={styles.navLink}>All Tools</Link>
                        <Link href="/category/optimization" className={styles.navLink}>Optimization</Link>
                        <Link href="/category/debloat" className={styles.navLink}>Debloat</Link>
                        <Link href="/blog" className={styles.navLink}>Blog</Link>
                        <Link href="/contact" className={styles.navLink}>Contact</Link>
                    </div>

                    {/* Desktop actions */}
                    <div className={styles.navActions}>
                        <button className={styles.cartBtn} onClick={toggleDrawer}>
                            Cart ({mounted ? items.length : 0})
                        </button>
                        {mounted && user ? (
                            <Link href="/dashboard" className={`btn-primary ${styles.profileBtn}`}>
                                <span className={styles.avatarIcon}>⚙</span> {user.email?.split('@')[0]}
                            </Link>
                        ) : (
                            <Link href="/login" className="btn-primary">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Hamburger toggle (mobile only) */}
                    <button
                        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </nav>

            {/* Full-screen mobile drawer */}
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} role="dialog" aria-modal="true">
                <Link href="/products" className={styles.mobileLink} onClick={closeMenu}>All Tools</Link>
                <div className={styles.mobileDivider} />
                <Link href="/category/optimization" className={styles.mobileLink} onClick={closeMenu}>Optimization</Link>
                <div className={styles.mobileDivider} />
                <Link href="/category/debloat" className={styles.mobileLink} onClick={closeMenu}>Debloat</Link>
                <div className={styles.mobileDivider} />
                <Link href="/blog" className={styles.mobileLink} onClick={closeMenu}>Blog</Link>
                <div className={styles.mobileDivider} />
                <Link href="/contact" className={styles.mobileLink} onClick={closeMenu}>Contact</Link>

                <div className={styles.mobileActions}>
                    <button
                        className={styles.cartBtn}
                        onClick={() => { toggleDrawer(); closeMenu(); }}
                        style={{ fontSize: '1.1rem' }}
                    >
                        🛒 Cart ({mounted ? items.length : 0})
                    </button>
                    {mounted && user ? (
                        <Link href="/dashboard" className="btn-primary" onClick={closeMenu} style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                            ⚙ {user.email?.split('@')[0]}
                        </Link>
                    ) : (
                        <Link href="/login" className="btn-primary" onClick={closeMenu} style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}>
                            Login / Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
