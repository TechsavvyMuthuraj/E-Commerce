'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './ReviewSection.module.css';

interface Review {
    id: string;
    rating: number;
    title: string;
    body: string;
    is_verified_purchase: boolean;
    created_at: string;
    profiles?: { full_name: string };
}

export default function ReviewSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        async function fetchReviews() {
            try {
                const { data, error } = await supabase
                    .from('product_reviews')
                    .select('*, profiles(full_name)')
                    .eq('product_id', productId)
                    .eq('status', 'approved')
                    .order('created_at', { ascending: false });

                if (data && !error) {
                    setReviews(data);
                }
            } catch (err) {
                console.error('Failed to fetch reviews', err);
            } finally {
                setLoading(false);
            }
        }
        if (productId) fetchReviews();
    }, [productId, submitSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setSubmitError("You must be logged in to leave a review.");
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId,
                    rating,
                    title,
                    body,
                    accessToken: session.access_token,
                    userId: session.user.id
                })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSubmitSuccess(true);
                setTitle('');
                setBody('');
                setRating(5);
            } else {
                setSubmitError(data.error || 'Failed to submit review.');
            }
        } catch (err) {
            setSubmitError('An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const avgRating = reviews.length ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1) : 0;

    return (
        <div className={styles.reviewSection}>
            <div className={styles.header}>
                <h3 className={styles.sectionTitle}>Verified Reviews</h3>
                <div className={styles.aggregate}>
                    <span className={styles.avgScore}>{avgRating}</span>
                    <span className={styles.starIcon}>★</span>
                    <span className={styles.reviewCount}>({reviews.length} reviews)</span>
                </div>
            </div>

            {submitSuccess ? (
                <div className={styles.successBanner}>
                    ✓ Your verified review has been published.
                </div>
            ) : (
                <form className={styles.reviewForm} onSubmit={handleSubmit}>
                    <h4 className={styles.formTitle}>Leave a Review</h4>
                    {submitError && <div className={styles.errorText}>{submitError}</div>}
                    <div className={styles.starPicker}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`${styles.starBtn} ${rating >= star ? styles.starActive : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Review Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <textarea
                        placeholder="Share your experience with this system..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className={styles.textarea}
                        required
                    />
                    <button type="submit" className={`btn-secondary ${styles.submitBtn}`} disabled={isSubmitting}>
                        {isSubmitting ? 'Verifying Purchase...' : 'Submit Review'}
                    </button>
                </form>
            )}

            <div className={styles.reviewsList}>
                {loading ? (
                    <div className={styles.loadingText}>Loading cryptographic reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className={styles.emptyText}>No reviews yet. Be the first to verify this asset.</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className={styles.reviewCard}>
                            <div className={styles.reviewHeader}>
                                <div className={styles.ratingBar}>
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                                {review.is_verified_purchase && <span className={styles.verifiedBadge}>✓ Verified Buyer</span>}
                            </div>
                            <h4 className={styles.reviewTitle}>{review.title}</h4>
                            <p className={styles.reviewBody}>{review.body}</p>
                            <div className={styles.reviewMeta}>
                                <span>{review.profiles?.full_name || 'Anonymous User'}</span>
                                <span>•</span>
                                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
