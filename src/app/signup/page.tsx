'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from '../login/page.module.css';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('redirect') || '/dashboard';

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    // if email confirmation is enabled in Supabase, this would send an email
                    // By default locally, it might confirm automatically or log them in
                    emailRedirectTo: `${window.location.origin}${redirectUrl}`
                }
            });
            if (error) throw error;

            if (data.session) {
                router.push(redirectUrl);
            } else {
                alert('Account created! Check your email to verify (if confirmation enabled), or try logging in.');
                router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during signup.');
        } finally {
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
                    <h1>Initialize Account</h1>
                    <p>Create your operational profile to get started.</p>
                </div>

                {error && <div className={styles.errorBanner}>{error}</div>}

                <form onSubmit={handleSignup} className={styles.form}>
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
                        <label htmlFor="password">Secure Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={8}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={isLoading}>
                        {isLoading ? 'Creating Profile...' : 'Create Account'}
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
                    Return to base? <Link href="/login" className={styles.accentLink}>System Login</Link>
                </p>
            </div>
        </div>
    );
}
