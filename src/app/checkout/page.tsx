'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from './page.module.css';

export default function CheckoutPage() {
    const { items, getCartTotal, getDiscountedTotal, couponCode, discountPercentage, applyCoupon, removeCoupon, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [localCoupon, setLocalCoupon] = useState('');
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const authenticateSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setIsCheckingAuth(false);
        };
        authenticateSession();
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

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you offline?');
                setIsProcessing(false);
                return;
            }

            // Request our local Next.js Route to initialize an Order
            const total = getCartTotal();
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, couponCode })
            });
            const data = await response.json();

            if (!response.ok || !data.order) {
                alert('Order creation failed. Check console.');
                console.error(data);
                setIsProcessing(false);
                return;
            }

            // Razorpay options
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'EXE TOOL',
                description: 'Payment for your digital tools',
                order_id: data.order.id,
                handler: async function (response: any) {
                    console.log('Payment Verification Triggered:', response);

                    try {
                        const { data: { session } } = await supabase.auth.getSession();

                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                cartItems: items,
                                accessToken: session?.access_token,
                                userId: user.id,
                                amount: getDiscountedTotal()
                            })
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            clearCart();
                            // Build download redirect URL
                            if (verifyData.downloadLinks?.length > 0) {
                                const params = new URLSearchParams();
                                params.set('orderId', verifyData.orderId);
                                verifyData.downloadLinks.forEach((d: any, i: number) => {
                                    params.set(`title${i}`, d.title);
                                    params.set(`link${i}`, d.downloadLink);
                                    params.set(`key${i}`, d.licenseKey);
                                });
                                params.set('count', String(verifyData.downloadLinks.length));
                                router.push(`/download?${params.toString()}`);
                            } else {
                                router.push('/order-success');
                            }
                        } else {
                            console.error('Verification failed:', verifyData);
                            alert('Payment could not be securely verified. Contact system administrator.');
                            setIsProcessing(false);
                        }
                    } catch (err) {
                        console.error('Verification ping failed:', err);
                        alert('Fatal error during transaction verification.');
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: (document.getElementById('fullname') as HTMLInputElement)?.value || 'John Doe',
                    email: (document.getElementById('email') as HTMLInputElement)?.value || 'john@example.com'
                },
                theme: {
                    color: '#F5A623'
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                    }
                }
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error(err);
            alert('Something went wrong initiating checkout.');
            setIsProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!localCoupon.trim()) return;
        setIsApplyingCoupon(true);
        setCouponError(null);

        try {
            const res = await fetch('/api/coupon/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: localCoupon, cartItems: items })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                applyCoupon(data.code, data.discountPercentage);
                setLocalCoupon('');
            } else {
                setCouponError(data.error || 'Invalid coupon');
            }
        } catch (err) {
            setCouponError('Error validating coupon');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    if (!mounted || isCheckingAuth) {
        return (
            <div className={`container ${styles.emptyState}`} style={{ padding: '8rem 2rem' }}>
                <p>Authenticating Session...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={`container ${styles.emptyState}`}>
                <h2>Authentication Required</h2>
                <p>You must be securely logged in to access the checkout gateway.</p>
                <button className="btn-primary" onClick={() => router.push('/login?redirect=/checkout')} style={{ marginTop: '1rem' }}>Log In Now</button>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={`container ${styles.emptyState}`}>
                <h2>Checkout Unavailable</h2>
                <p>Your cart is completely empty.</p>
                <button className="btn-secondary" onClick={() => router.push('/products')} style={{ marginTop: '1rem' }}>Browse Tools</button>
            </div>
        );
    }

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.header}>
                <h1>Secure Checkout</h1>
            </div>

            <div className={styles.grid}>
                <div className={styles.formSection}>
                    <form className={styles.checkoutForm} onSubmit={handleCheckout}>
                        <div className={styles.formGroup}>
                            <h3 className={styles.sectionTitle}>Billing Details</h3>

                            <div className={styles.inputRow}>
                                <div className={styles.inputField}>
                                    <label>Full Name</label>
                                    <input id="fullname" type="text" placeholder="John Doe" required className={styles.input} />
                                </div>
                                <div className={styles.inputField}>
                                    <label>Email Address</label>
                                    <input id="email" type="email" placeholder="john@example.com" required className={styles.input} />
                                </div>
                            </div>

                            <div className={styles.inputField}>
                                <label>Company/Organization (Optional)</label>
                                <input type="text" placeholder="Acme Corp" className={styles.input} />
                            </div>

                            <div className={styles.inputField}>
                                <label>Country</label>
                                <select className={styles.select} required>
                                    <option value="US">United States</option>
                                    <option value="IN">India</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="EU">European Union</option>
                                </select>
                            </div>
                        </div>

                        <button type="submit" className={`btn-primary ${styles.payBtn}`} disabled={isProcessing}>
                            {isProcessing ? 'Initializing Razorpay...' : `Pay ₹${getDiscountedTotal()} via Razorpay`}
                        </button>
                    </form>
                </div>

                <div className={styles.summarySection}>
                    <div className={styles.summaryCard}>
                        <h3 className={styles.sectionTitle}>Order Summary</h3>

                        <div className={styles.orderItems}>
                            {items.map(item => (
                                <div key={item.id} className={styles.orderItem}>
                                    <div className={styles.itemImage} style={{ background: item.image }}></div>
                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemTitle}>{item.title}</div>
                                        <div className={styles.itemMeta}>
                                            <span className={styles.badge}>{item.licenseTier}</span>
                                            <span className={`pricing-code ${styles.price}`}>₹{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span className={couponCode ? styles.strikethrough : ''}>₹{getCartTotal()}</span>
                            </div>

                            {/* COUPON SYSTEM UI */}
                            {couponCode ? (
                                <div className={`${styles.totalRow} ${styles.discountRow}`} style={{ color: '#4CAF50' }}>
                                    <span>
                                        Discount ({couponCode}) - {discountPercentage}%
                                        <button onClick={removeCoupon} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#f44336', cursor: 'pointer', fontSize: '0.8rem' }}>Remove</button>
                                    </span>
                                    <span>-₹{(getCartTotal() - getDiscountedTotal()).toFixed(2)}</span>
                                </div>
                            ) : (
                                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Enter Promo Code"
                                            value={localCoupon}
                                            onChange={(e) => setLocalCoupon(e.target.value)}
                                            className={styles.input}
                                            style={{ flex: 1, padding: '0.75rem' }}
                                        />
                                        <button
                                            type="button"
                                            className="btn-secondary"
                                            onClick={handleApplyCoupon}
                                            disabled={isApplyingCoupon || !localCoupon.trim()}
                                        >
                                            {isApplyingCoupon ? '...' : 'Apply'}
                                        </button>
                                    </div>
                                    {couponError && <div style={{ color: '#f44336', fontSize: '0.85rem', marginTop: '0.5rem' }}>{couponError}</div>}
                                </div>
                            )}

                            <div className={styles.totalRow}>
                                <span>Tax (Calculated at gateway)</span>
                                <span>--</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <span>Total Due</span>
                                <span className={`pricing-code ${styles.accent}`}>₹{getDiscountedTotal()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
