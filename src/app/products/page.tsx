import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const allProducts = [
    { slug: 'nexus-engine', title: 'Nexus Engine Pro', category: 'SaaS', price: 149, image: 'linear-gradient(45deg, #1A1A1E, #333)' },
    { slug: 'quantum-ui', title: 'Quantum UI Kit', category: 'Templates', price: 79, image: 'linear-gradient(135deg, #252528, #1A1A1E)' },
    { slug: 'forge-cli', title: 'Forge CLI Tool', category: 'Tools', price: 29, image: 'linear-gradient(to top, #111, #222)' },
    { slug: 'strata-dashboard', title: 'Strata Admin Dashboard', category: 'Templates', price: 99, image: 'linear-gradient(to right, #1a1a1e, #111)' },
    { slug: 'voxel-grid', title: 'Voxel Asset Pack', category: 'Plugins', price: 45, image: 'linear-gradient(120deg, #333, #000)' },
    { slug: 'auth-layer', title: 'AuthLayer Module', category: 'Tools', price: 59, image: 'linear-gradient(to bottom, #252528, #101010)' }
];

export default function ProductsPage() {
    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.header}>
                <h1>All Products</h1>
                <div className={styles.filters}>
                    <select className={styles.select}>
                        <option>All Categories</option>
                        <option>SaaS</option>
                        <option>Plugins</option>
                        <option>Templates</option>
                        <option>Tools</option>
                    </select>
                    <select className={styles.select}>
                        <option>Sort: Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest</option>
                    </select>
                </div>
            </div>

            <div className={styles.productGrid}>
                {allProducts.map(product => (
                    <ProductCard key={product.slug} {...product} />
                ))}
            </div>
        </div>
    );
}
