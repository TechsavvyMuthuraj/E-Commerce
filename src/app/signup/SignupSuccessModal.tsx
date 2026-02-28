'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SignupSuccessModal.module.css';

interface Props {
    email: string;
    redirectUrl: string;
}

export default function SignupSuccessModal({ email, redirectUrl }: Props) {
    const [step, setStep] = useState(0);
    const [mockKey, setMockKey] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Generate a fake license key for the visual effect
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const key = Array(16).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
        setMockKey(`EXE-${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(8, 12)}`);

        // Animation Sequence
        const timer1 = setTimeout(() => setStep(1), 800);  // "Initializing profile..."
        const timer2 = setTimeout(() => setStep(2), 2000); // "Generating access token..."
        const timer3 = setTimeout(() => setStep(3), 3500); // Show License Key
        const timer4 = setTimeout(() => {
            // Auto-redirect after showing the key
            router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}&email=${encodeURIComponent(email)}`);
        }, 8000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [email, redirectUrl, router]);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>

                <div className={styles.scanline}></div>

                {step === 0 && (
                    <div className={styles.processing}>
                        <div className={styles.spinner}></div>
                        <p className={styles.terminalText}>&gt; ESTABLISHING SECURE CONNECTION...</p>
                    </div>
                )}

                {step === 1 && (
                    <div className={styles.processing}>
                        <div className={styles.spinner}></div>
                        <p className={styles.terminalText}>&gt; PROVISIONING OPERATOR PROFILE: <span className={styles.accent}>{email}</span></p>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.processing}>
                        <div className={styles.spinner}></div>
                        <p className={styles.terminalText}>&gt; GENERATING HARDWARE ENCRYPTION KEY...</p>
                    </div>
                )}

                {step === 3 && (
                    <div className={styles.successScreen}>
                        <div className={styles.shieldIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M9 12l2 2 4-4" />
                            </svg>
                        </div>
                        <h2 className={styles.title}>ACCESS GRANTED</h2>
                        <p className={styles.subtitle}>Profile successfully initialized.</p>

                        <div className={styles.keyBox}>
                            <div className={styles.keyLabel}>TEMPORARY AUTH TOKEN</div>
                            <div className={styles.keyValue}>{mockKey}</div>
                        </div>

                        <p className={styles.redirectText}>
                            Redirecting to secure login in 4 seconds...
                        </p>
                        <button className={styles.manualBtn} onClick={() => router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)}>
                            PROCEED NOW &gt;
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
