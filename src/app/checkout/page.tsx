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
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const authenticateSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user || null);
            setIsCheckingAuth(false);

            // AUTO-REDIRECT IF LINK EXISTS
            // If the user lands here and we have a direct pay link, skip this page!
            const itemWithPayLink = items.find(item => item.paymentLink);
            if (itemWithPayLink?.paymentLink) {
                window.location.href = itemWithPayLink.paymentLink;
            }
        };
        authenticateSession();
    }, [items]);



    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // Find an item with a custom payment link
            const itemWithPayLink = items.find(item => item.paymentLink);

            if (itemWithPayLink?.paymentLink) {
                // Redirect directly to the custom payment link (Razorpay, Stripe, etc.)
                window.location.href = itemWithPayLink.paymentLink;
                return;
            } else {
                alert('This item does not have a direct payment link configured. Please contact the administrator.');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong initiating checkout.');
            setIsProcessing(false);
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
            {/* Trust Badges */}
            <div className={styles.trustBar}>
                {[{ icon: '🔒', label: '256-bit SSL Encrypted' }, { icon: '✅', label: 'Instant Delivery' }, { icon: '↩️', label: 'Easy Refund Policy' }, { icon: '🛡️', label: 'Secure Gateway' }].map(t => (
                    <div key={t.label} className={styles.trustItem}>
                        <span className={styles.trustIcon}>{t.icon}</span>{t.label}
                    </div>
                ))}
            </div>
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
                            {isProcessing ? 'Redirecting to Payment Gateway...' : 'COMPLETE PURCHASE (EXTERNAL LINK)'}
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
