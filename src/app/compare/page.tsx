'use client';

import React from 'react';
import Link from 'next/link';
import { useCompareStore } from '@/store/useCompareStore';
import styles from './page.module.css';

export default function ComparePage() {
    const { compareItems, removeFromCompare, clearCompare } = useCompareStore();

    if (compareItems.length === 0) {
        return (
            <div className={`container ${styles.emptyState}`}>
                <h1>No Products Selected</h1>
                <p>Add up to 3 products using the "Add to Compare" button on any product card.</p>
                <Link href="/products" className="btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>
                    Browse Products
                </Link>
            </div>
        );
    }

    // Collect all unique feature labels across compared products
    const allFeatures = Array.from(new Set(compareItems.flatMap(p => p.features)));

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.topBar}>
                <div>
                    <h1 className={styles.title}>Product Comparison</h1>
                    <p className={styles.subtitle}>Side-by-side feature analysis</p>
                </div>
                <button className={styles.clearBtn} onClick={clearCompare}>Clear All</button>
            </div>

            <div className={styles.compareGrid} style={{ gridTemplateColumns: `200px repeat(${compareItems.length}, 1fr)` }}>

                {/* Header Row */}
                <div className={styles.featureHeader}>Features</div>
                {compareItems.map(product => (
                    <div key={product.slug} className={styles.productHeader}>
                        <div className={styles.productThumb} style={{ background: product.image }}></div>
                        <Link href={`/products/${product.slug}`} className={styles.productName}>{product.title}</Link>
                        <div className={styles.productPrice}>₹{product.price}</div>
                        <button className={styles.removeBtn} onClick={() => removeFromCompare(product.slug)}>Remove ✕</button>
                        <Link href={`/products/${product.slug}`} className={`btn-primary ${styles.buyBtn}`}>
                            Buy Now
                        </Link>
                    </div>
                ))}

                {/* Price Row */}
                <div className={styles.featureCell}>Starting Price</div>
                {compareItems.map(product => (
                    <div key={product.slug} className={`${styles.dataCell} ${styles.priceCell}`}>
                        ₹{product.price}
                    </div>
                ))}

                {/* Feature Rows */}
                {allFeatures.map(feature => {
                    const values = compareItems.map(p => p.features.includes(feature));
                    const allHave = values.every(Boolean);
                    const noneHave = values.every(v => !v);

                    return (
                        <React.Fragment key={feature}>
                            <div className={styles.featureCell}>{feature}</div>
                            {compareItems.map((product) => {
                                const has = product.features.includes(feature);
                                return (
                                    <div
                                        key={`${product.slug}-${feature}`}
                                        className={`${styles.dataCell} ${has ? (allHave ? styles.matchCell : styles.winCell) : styles.missCell}`}
                                    >
                                        {has ? '✓' : '—'}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
