'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

function CustomPayContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const amountStr = searchParams.get('amount');
    const labelStr = searchParams.get('label') || 'Custom Order';
    const amount = Number(amountStr);

    const [isProcessing, setIsProcessing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const authenticate = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setIsCheckingAuth(false);
        };
        authenticate();
    }, []);

    const loadRazorpay = async () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async () => {
        if (!amount || amount <= 0) return;
        setIsProcessing(true);

        try {
            const hasSdk = await loadRazorpay();
            if (!hasSdk) { alert('SDK failed to load'); setIsProcessing(false); return; }

            const res = await fetch('/api/checkout/custom', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, label: labelStr })
            });
            const data = await res.json();
            if (!res.ok || !data.order) { alert(data.error || 'Server error'); setIsProcessing(false); return; }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'EXE TOOL',
                description: labelStr,
                order_id: data.order.id,
                handler: async function (response: any) {
                    setIsProcessing(true);
                    // Standard verification but with a "custom_amount" flag
                    const verifyRes = await fetch('/api/verify-payment', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: user?.id || 'guest',
                            amount: amount,
                            isCustomOrder: true,
                            label: labelStr
                        })
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyRes.ok && verifyData.success) {
                        router.push('/order-success');
                    } else {
                        alert('Verification failed. Use help to resolve.');
                        setIsProcessing(false);
                    }
                },
                prefill: { email: user?.email || '', name: user?.user_metadata?.full_name || '' },
                theme: { color: '#F5A623' },
                modal: { ondismiss: () => setIsProcessing(false) }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert('Checkout failed initiation');
            setIsProcessing(false);
        }
    };

    if (isCheckingAuth) return <div className={styles.container}><p>Checking connectivity...</p></div>;

    if (!amountStr || isNaN(amount) || amount <= 0) {
        return (
            <div className={styles.container}>
                <h1 style={{ color: '#f44336' }}>Invalid Payment Link</h1>
                <p>This link appears to be broken or has an invalid amount.</p>
                <a href="/products" className="btn-secondary">Go to Marketplace</a>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.container}>
                <h1>Quick Auth Required</h1>
                <p>Please log in to your EXE TOOL account to proceed with this custom order.</p>
                <button
                    className="btn-primary"
                    onClick={() => router.push(`/login?redirect=${encodeURIComponent(window.location.href)}`)}
                    style={{ marginTop: '1.5rem' }}
                >Log In / Sign Up</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.paymentCard}>
                <div className={styles.header}>
                    <div className={styles.brand}>EXE TOOL — Secure Pay</div>
                    <div className={styles.title}>{labelStr}</div>
                </div>

                <div className={styles.amountSection}>
                    <div className={styles.amountLabel}>Total Payable Amount</div>
                    <div className={styles.amountValue}>₹{amount.toLocaleString('en-IN')}</div>
                    <div className={styles.guarantee}>✓ Secure Encryption Active · Razorpay Verified</div>
                </div>

                <div className={styles.userSection}>
                    <span>Authenticated as</span>
                    <strong>{user.email}</strong>
                </div>

                <button
                    className={`btn-primary ${styles.payBtn}`}
                    onClick={handleCheckout}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Connecting...' : `Pay ₹${amount} Securely`}
                </button>

                <div className={styles.footer}>
                    By paying, you agree to our Terms of Service. Download links (if any) will be sent to your email after verification.
                </div>
            </div>
        </div>
    );
}

export default function CustomPayPage() {
    return (
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '10rem' }}>Loading Payment Interface...</div>}>
            <CustomPayContent />
        </Suspense>
    );
}
