'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;

            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('redirect') || '/dashboard';

            if (data.session) {
                router.push(redirectUrl);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('redirect') || '/dashboard';

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}${redirectUrl}`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || 'An error occurred with Google login.');
            setIsLoading(false);
        }
    };

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.authContainer}>
                <div className={styles.header}>
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your tools and licenses.</p>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="operator@system.io"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.passwordHeader}>
                            <label htmlFor="password">Password</label>
                            <Link href="/forgot-password" className={styles.forgotLink}>Forgot?</Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'System Login'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>OR CONTINUE WITH</span>
                </div>

                <button
                    className={`btn-secondary ${styles.oauthBtn}`}
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                >
                    {/* Simple mock Google icon */}
                    <span className={styles.oauthIcon}>G</span>
                    Google Platform
                </button>

                <p className={styles.footer}>
                    New personnel? <button onClick={() => {
                        const search = typeof window !== 'undefined' ? window.location.search : '';
                        router.push(`/signup${search}`);
                    }} className={styles.accentLink} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Request Access</button>
                </p>
            </div>
        </div>
    );
}
