'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './StickyCTA.module.css';

export default function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.products?.length > 0) {
                    setProduct(data.products[0]);
                }
            } catch (err) {
                console.error('Failed to fetch CTA product', err);
            }
        };
        fetchProduct();

        const handleScroll = () => {
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const title = product?.title || 'EXE TOOL PREMIUM';
    const tier = product?.pricingTiers?.[0];
    const salePrice = tier?.price || 499;
    const msrpPrice = tier?.originalPrice || null;
    const checkoutLink = product
        ? `/checkout/${product.slug}?tier=${encodeURIComponent(tier?.name || 'Standard')}`
        : '/checkout/bundle-pro';

    return (
        <div className={`${styles.stickyBar} ${isVisible ? styles.visible : ''}`}>
            <div className={`container ${styles.content}`}>
                <div className={styles.textGroup}>
                    <span className={styles.lightning}>⚡</span>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.price}>
                        {msrpPrice && (
                            <span className={styles.strikethrough}>₹{msrpPrice}</span>
                        )}
                        <span className={styles.current}>₹{salePrice}</span>
                    </span>
                </div>
                <Link href={checkoutLink} className={styles.buyButton}>
                    BUY NOW
                </Link>
            </div>
        </div>
    );
}
