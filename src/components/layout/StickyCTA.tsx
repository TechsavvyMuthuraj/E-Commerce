'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './StickyCTA.module.css';

export default function StickyCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        // Fetch specific product to display (fetching all and grabbing the first/featured one)
        const fetchProduct = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.products && data.products.length > 0) {
                    // For now, grabbing the first product in the catalog. 
                    // To "choose" another, we could filter by slug here.
                    setProduct(data.products[0]);
                }
            } catch (err) {
                console.error("Failed to fetch CTA product", err);
            }
        };
        fetchProduct();

        const handleScroll = () => {
            // Show after scrolling 500px (past hero)
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fallbacks if Sanity product isn't loaded
    const title = product?.title || 'EXE TOOL PREMIUM';
    const tier = product?.pricingTiers?.[0]; // Grab standard tier
    const salePrice = tier?.price || 499;
    const msrpPrice = tier?.originalPrice || null;
    const checkoutLink = product ? `/checkout/${product.slug}?tier=${encodeURIComponent(tier?.name || 'Standard')}` : '/checkout/bundle-pro';

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
