'use client';

import { useState, use, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { sanityClient } from '@/lib/sanity';
import styles from './page.module.css';

// Mock database fallback
const getMockProduct = (slug: string) => ({
    id: `mock-${slug}`,
    slug,
    title: slug.replace(/-/g, ' ').toUpperCase(),
    category: 'SaaS',
    shortDescription: 'The ultimate industrial-grade tool to accelerate your workflow and supercharge your backend setup.',
    longDescription: 'Engineered for precision and built with performance in mind. This bundle includes everything you need to bootstrap a top-tier project without writing the boilerplate.',
    features: ['Authentication pre-configured', 'Database schema included', 'High performance caching layer'],
    pricingTiers: [
        { name: 'Personal', price: 49, licenseType: 'PER' },
        { name: 'Commercial', price: 149, licenseType: 'COM' }
    ],
    image: 'linear-gradient(45deg, #1A1A1E, #333)'
});

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [selectedTier, setSelectedTier] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addItem, openDrawer } = useCartStore();

    useEffect(() => {
        async function fetchProduct() {
            try {
                // Attempt to fetch from real Sanity CMS First
                const query = `*[_type == "product" && slug.current == $slug][0] {
                    _id, title, "slug": slug.current, category, shortDescription, longDescription, features, pricingTiers,
                    "imageUrl": mainImage.asset->url
                }`;
                const data = await sanityClient.fetch(query, { slug });

                if (data && data.pricingTiers) {
                    setProduct({ ...data, id: data._id, image: `url(${data.imageUrl}) center/cover` });
                    setSelectedTier(data.pricingTiers[0]);
                } else {
                    // Fallback to mock if Sanity is empty/unconfigured
                    const mock = getMockProduct(slug);
                    setProduct(mock);
                    setSelectedTier(mock.pricingTiers[0]);
                }
            } catch (err) {
                // Fallback to mock on network/config error
                const mock = getMockProduct(slug);
                setProduct(mock);
                setSelectedTier(mock.pricingTiers[0]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (!product || !selectedTier) return;
        addItem({
            id: `${product.slug}-${selectedTier.licenseType}`,
            productId: product.id,
            slug: product.slug,
            title: product.title,
            price: selectedTier.price,
            licenseTier: selectedTier.licenseType,
            image: product.image?.startsWith('http') ? `url(${product.image}) center/cover` : product.image
        });
        openDrawer();
    };

    if (isLoading) return <div className={`container ${styles.page}`} style={{ color: 'var(--muted)' }}>Loading Asset Specifications...</div>;
    if (!product) return <div className={`container ${styles.page}`}>Asset not found.</div>;

    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.grid}>
                <div className={styles.galleryPhase}>
                    <div className={styles.mainImage} style={{ background: product.image }}></div>
                    <div className={styles.thumbnails}>
                        <div className={styles.thumbnail} style={{ background: 'linear-gradient(to right, #111, #222)' }}></div>
                        <div className={styles.thumbnail} style={{ background: 'linear-gradient(to bottom, #111, #222)' }}></div>
                        <div className={styles.thumbnail} style={{ background: 'linear-gradient(to top, #111, #222)' }}></div>
                    </div>
                </div>

                <div className={styles.contentPhase}>
                    <div className={styles.header}>
                        <span className={styles.categoryBadge}>{product.category}</span>
                        <h1 className={styles.title}>{product.title}</h1>
                        <p className={styles.shortDesc}>{product.shortDescription}</p>
                    </div>

                    <div className={styles.pricingSection}>
                        <h3 className={styles.sectionTitle}>License Option</h3>
                        <div className={styles.tiersGrid}>
                            {product.pricingTiers.map((tier: { licenseType: string; name: string; price: number }) => (
                                <div
                                    key={tier.licenseType}
                                    className={`${styles.tierCard} ${selectedTier.licenseType === tier.licenseType ? styles.activeTier : ''}`}
                                    onClick={() => setSelectedTier(tier)}
                                >
                                    <div className={styles.tierName}>{tier.name}</div>
                                    <div className={`pricing-code ${styles.tierPrice}`}>${tier.price}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.actionSection}>
                        <div className={styles.selectedPrice}>
                            <span className={styles.priceLabel}>Total</span>
                            <span className={`pricing-code ${styles.finalPrice}`}>${selectedTier.price}</span>
                        </div>
                        <button className={`btn-primary ${styles.addToCartBtn}`} onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                    </div>

                    <div className={styles.detailsSection}>
                        <h3 className={styles.sectionTitle}>Description</h3>
                        <p className={styles.longDesc}>{product.longDescription}</p>

                        <h3 className={styles.sectionTitle}>Features</h3>
                        <ul className={styles.featureList}>
                            {product.features.map((feature: string, i: number) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
