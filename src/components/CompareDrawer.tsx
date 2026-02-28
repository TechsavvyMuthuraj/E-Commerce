'use client';

import Link from 'next/link';
import { useCompareStore } from '@/store/useCompareStore';
import styles from './CompareDrawer.module.css';

export default function CompareDrawer() {
    const { compareItems, removeFromCompare, clearCompare } = useCompareStore();

    if (compareItems.length === 0) return null;

    return (
        <div className={styles.drawer}>
            <div className={styles.inner}>
                <div className={styles.label}>
                    <span className={styles.labelText}>Compare</span>
                    <span className={styles.count}>{compareItems.length}/3</span>
                </div>

                <div className={styles.items}>
                    {compareItems.map(item => (
                        <div key={item.slug} className={styles.item}>
                            <div className={styles.itemThumb} style={{ background: item.image }} />
                            <div className={styles.itemInfo}>
                                <span className={styles.itemTitle}>{item.title}</span>
                                <span className={styles.itemPrice}>₹{item.price}</span>
                            </div>
                            <button
                                className={styles.removeBtn}
                                onClick={() => removeFromCompare(item.slug)}
                                aria-label={`Remove ${item.title}`}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {/* Empty slots */}
                    {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                        <div key={`empty-${i}`} className={styles.emptySlot}>
                            <span>+ Add Product</span>
                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button className={styles.clearBtn} onClick={clearCompare}>Clear</button>
                    <Link
                        href="/compare"
                        className={`btn-primary ${styles.compareBtn}`}
                    >
                        Compare Now →
                    </Link>
                </div>
            </div>
        </div>
    );
}
