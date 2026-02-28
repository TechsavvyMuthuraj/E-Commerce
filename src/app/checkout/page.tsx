'use client';

import { useCartStore } from '@/store/useCartStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
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
                body: JSON.stringify({ amount: total })
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
                name: 'Tools & Software E-Commerce',
                description: 'Payment for your digital tools',
                order_id: data.order.id,
                handler: function (response: any) {
                    console.log('Payment Success:', response);
                    // On success, redirect to success screen & flush cart
                    clearCart();
                    router.push('/order-success');
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

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className={`container ${styles.emptyState}`}>
                <h2>Checkout Unavailable</h2>
                <p>Your cart is completely empty.</p>
                <button className="btn-secondary" onClick={() => router.push('/products')}>Browse Tools</button>
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
                            {isProcessing ? 'Initializing Razorpay...' : `Pay $${getCartTotal()} via Razorpay`}
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
                                            <span className={`pricing-code ${styles.price}`}>${item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.totals}>
                            <div className={styles.totalRow}>
                                <span>Subtotal</span>
                                <span className="pricing-code">${getCartTotal()}</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Tax (Calculated at gateway)</span>
                                <span className="pricing-code">--</span>
                            </div>
                            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
                                <span>Total Due</span>
                                <span className={`pricing-code ${styles.accent}`}>${getCartTotal()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
