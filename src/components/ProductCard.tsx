import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';

interface ProductCardProps {
    title: string;
    category: string;
    price: number;
    image: string;
    slug: string;
}

export default function ProductCard({ title, category, price, image, slug }: ProductCardProps) {
    return (
        <div className={styles.card}>
            <Link href={`/products/${slug}`} className={styles.imageWrapper}>
                <div
                    className={styles.placeholderImage}
                    style={{
                        background: image.startsWith('http') || image.startsWith('/')
                            ? `url('${image}') center/cover`
                            : image
                    }}
                >
                    {/* We use a colored placeholder for now instead of Next Image to avoid host errors */}
                </div>
                <div className={styles.overlay}>
                    <span className={styles.quickAdd}>View Details</span>
                </div>
            </Link>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.category}>{category}</span>
                    <span className={`pricing-code ${styles.price}`}>${price}</span>
                </div>
                <Link href={`/products/${slug}`}>
                    <h3 className={styles.title}>{title}</h3>
                </Link>
            </div>
        </div>
    );
}
