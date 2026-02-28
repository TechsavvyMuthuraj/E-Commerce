import ProductCard from '@/components/ProductCard';
import styles from '@/app/products/page.module.css';

// Reusing mock products for now, but formatted to filter by category slug
const mockProducts = [
    { slug: 'nexus-engine', title: 'Nexus Engine Pro', category: 'SaaS', price: 149, image: 'linear-gradient(45deg, #1A1A1E, #333)' },
    { slug: 'quantum-ui', title: 'Quantum UI Kit', category: 'Templates', price: 79, image: 'linear-gradient(135deg, #252528, #1A1A1E)' },
    { slug: 'forge-cli', title: 'Forge CLI Tool', category: 'Tools', price: 29, image: 'linear-gradient(to top, #111, #222)' },
    { slug: 'strata-dashboard', title: 'Strata Admin Dashboard', category: 'Templates', price: 99, image: 'linear-gradient(to right, #1a1a1e, #111)' },
    { slug: 'voxel-grid', title: 'Voxel Asset Pack', category: 'Plugins', price: 45, image: 'linear-gradient(120deg, #333, #000)' },
    { slug: 'auth-layer', title: 'AuthLayer Module', category: 'Tools', price: 59, image: 'linear-gradient(to bottom, #252528, #101010)' }
];

interface CategoryPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const resolvedParams = await params;
    const categorySlug = resolvedParams.slug;
    const normalizedCategory = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

    // Simulated filter (In Sanity, this would be a GROQ query like: *[_type == "product" && category match $category])
    const filteredProducts = mockProducts.filter(
        product => product.category.toLowerCase() === categorySlug.toLowerCase()
    );

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.header}>
                <h1>{normalizedCategory}</h1>
                <div className={styles.filters}>
                    <select className={styles.select}>
                        <option>Sort: Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Newest</option>
                    </select>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '1.2rem', marginTop: '2rem' }}>
                    No products found in this category yet.
                </div>
            ) : (
                <div className={styles.productGrid}>
                    {filteredProducts.map(product => (
                        <ProductCard key={product.slug} {...product} />
                    ))}
                </div>
            )}
        </div>
    );
}
