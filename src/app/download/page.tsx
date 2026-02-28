'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

function DownloadContent() {
    const params = useSearchParams();
    const orderId = params.get('orderId') || '';
    const count = parseInt(params.get('count') || '0', 10);

    const downloads: { title: string; link: string; key: string }[] = [];
    for (let i = 0; i < count; i++) {
        downloads.push({
            title: params.get(`title${i}`) || `Product ${i + 1}`,
            link: params.get(`link${i}`) || '',
            key: params.get(`key${i}`) || '',
        });
    }

    return (
        <div className={styles.page}>
            {/* Success header */}
            <div className={styles.successBanner}>
                <div className={styles.checkIcon}>✓</div>
                <div>
                    <h1 className={styles.successTitle}>Payment Successful!</h1>
                    <p className={styles.successSub}>
                        Thank you for your purchase.
                        {orderId && <span> Order ID: <code className={styles.orderId}>{orderId}</code></span>}
                    </p>
                </div>
            </div>

            {/* Download cards */}
            <div className={styles.cardsSection}>
                <h2 className={styles.sectionTitle}>Your Downloads</h2>
                <p className={styles.sectionSub}>
                    Click the download button below. Save your license key — it's proof of purchase.
                </p>

                {downloads.length === 0 ? (
                    <div className={styles.noDownload}>
                        <div className={styles.noDownloadIcon}>📬</div>
                        <p>Your download link will be emailed to you shortly.</p>
                        <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                            If you don't receive it in 10 minutes, contact support.
                        </p>
                    </div>
                ) : (
                    <div className={styles.cards}>
                        {downloads.map((d, i) => (
                            <div key={i} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.productIconWrap}>
                                        <span className={styles.productIcon}>⚙</span>
                                    </div>
                                    <div>
                                        <div className={styles.productTitle}>{d.title}</div>
                                        <div className={styles.productStatus}>
                                            <span className={styles.statusDot}></span> Ready to download
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.licenseBlock}>
                                    <div className={styles.licenseLabel}>License Key</div>
                                    <div className={styles.licenseKey}>{d.key}</div>
                                    <button
                                        className={styles.copyBtn}
                                        onClick={() => {
                                            navigator.clipboard?.writeText(d.key);
                                            const btn = document.getElementById(`copy-${i}`);
                                            if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy Key'; }, 2000); }
                                        }}
                                        id={`copy-${i}`}
                                    >
                                        Copy Key
                                    </button>
                                </div>

                                <a
                                    href={d.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.downloadBtn}
                                    download
                                >
                                    ⬇ Download {d.title}
                                </a>

                                <div className={styles.cardFooter}>
                                    Keep this key safe — needed for future reinstalls and support.
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info boxes */}
            <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                    <div className={styles.infoIcon}>📧</div>
                    <div className={styles.infoTitle}>Check Your Email</div>
                    <div className={styles.infoText}>A receipt and download link has been sent to your registered email address.</div>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.infoIcon}>🔑</div>
                    <div className={styles.infoTitle}>License Key</div>
                    <div className={styles.infoText}>Your license key is unique to this purchase. It activates the software during installation.</div>
                </div>
                <div className={styles.infoBox}>
                    <div className={styles.infoIcon}>🛟</div>
                    <div className={styles.infoTitle}>Need Help?</div>
                    <div className={styles.infoText}>Having trouble downloading? Visit the contact page or check your order in the dashboard.</div>
                </div>
            </div>

            <div className={styles.actions}>
                <Link href="/products" className="btn-secondary">← Browse More Tools</Link>
                <Link href="/dashboard" className="btn-primary">View My Orders</Link>
            </div>
        </div>
    );
}

export default function DownloadPage() {
    return (
        <Suspense fallback={<div className="container" style={{ padding: '4rem', color: 'var(--muted)' }}>Loading your download...</div>}>
            <DownloadContent />
        </Suspense>
    );
}
