'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './layout.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_PASSWORD = 'admin2026@';

const navItems = [
    { href: '/admin', label: '⬛ Dashboard', exact: true },
    { href: '/admin/products', label: '📦 Products' },
    { href: '/admin/blogs', label: '✏️ Blog Posts' },
    { href: '/admin/coupons', label: '🏷️ Coupons' },
    { href: '/admin/reviews', label: '⭐ Reviews' },
    { href: '/admin/orders', label: '📋 Orders' },
    { href: '/admin/pay-links', label: '🔗 Payment Links' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authed, setAuthed] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const stored = sessionStorage.getItem('admin_auth');
        if (stored === 'true') setAuthed(true);
        setChecking(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('admin_auth', 'true');
            setAuthed(true);
        } else {
            setError('Invalid admin password.');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setAuthed(false);
    };

    if (checking) return null;

    if (!authed) {
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginBox}>
                    <div className={styles.loginLogo}>EXE<span> TOOL</span></div>
                    <h2 className={styles.loginTitle}>Admin Access</h2>
                    <p className={styles.loginSub}>Restricted zone — enter admin password to continue</p>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <input
                            type="password"
                            placeholder="Admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.loginInput}
                            autoFocus
                        />
                        {error && <span className={styles.loginError}>{error}</span>}
                        <button type="submit" className={`btn-primary ${styles.loginBtn}`}>
                            Enter Admin Panel →
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminShell}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarLogo}>EXE<span> TOOL</span></div>
                <div className={styles.sidebarLabel}>Admin Console</div>

                {/* Admin Profile Block */}
                <div className={styles.adminProfile}>
                    <div className={styles.adminAvatar}>M</div>
                    <div className={styles.adminInfo}>
                        <div className={styles.adminName}>Muthuraj C</div>
                        <div className={styles.adminRole}>Super Admin</div>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map(item => {
                        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${active ? styles.navActive : ''}`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.viewSiteLink} target="_blank">↗ View Site</Link>
                    <button className={styles.logoutBtn} onClick={handleLogout}>Log Out</button>
                </div>
            </aside>
            <main className={styles.adminMain}>
                {children}
            </main>
        </div>
    );
}
