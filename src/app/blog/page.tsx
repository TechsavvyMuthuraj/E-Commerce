'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Image from 'next/image';

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    readTime: string;
    publishedAt: string;
    _createdAt: string;
    coverImage?: string;
}

const FALLBACK_POSTS: BlogPost[] = [
    {
        _id: 'f1', slug: 'how-to-speed-up-windows-11',
        title: 'How to Speed Up Windows 11 in 10 Steps',
        excerpt: 'Windows 11 ships with a lot of background services that eat RAM and CPU. Here are 10 battle-tested tweaks to reclaim performance.',
        category: 'Windows Tips', readTime: '5 min read',
        publishedAt: '2026-02-28', _createdAt: '2026-02-28',
    },
    {
        _id: 'f2', slug: 'debloat-windows-the-right-way',
        title: 'Debloat Windows — The Right Way',
        excerpt: 'Removing the wrong apps can break Windows Update. This guide shows you which are safe to remove and which to leave alone.',
        category: 'Optimization Guides', readTime: '8 min read',
        publishedAt: '2026-02-20', _createdAt: '2026-02-20',
    },
    {
        _id: 'f3', slug: 'windows-gaming-performance-guide',
        title: 'The Ultimate Windows Gaming Performance Guide',
        excerpt: 'From BIOS settings to GPU driver tweaks — everything you need to squeeze out those extra frames.',
        category: 'Gaming Performance', readTime: '12 min read',
        publishedAt: '2026-02-10', _createdAt: '2026-02-10',
    },
    {
        _id: 'f4', slug: 'registry-tweaks-guide',
        title: 'Registry Tweaks That Actually Work in 2026',
        excerpt: 'We tested 40+ registry tweaks so you don\'t have to. These are the ones that deliver real improvements.',
        category: 'Deep Dives', readTime: '10 min read',
        publishedAt: '2026-02-05', _createdAt: '2026-02-05',
    },
];

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return dateStr; }
}

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [usingFallback, setUsingFallback] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch('/api/blog', { cache: 'no-store' });
            const data = await res.json();
            if (data.posts && data.posts.length > 0) {
                setPosts(data.posts);
                setUsingFallback(false);
            } else {
                setPosts(FALLBACK_POSTS);
                setUsingFallback(true);
            }
        } catch {
            setPosts(FALLBACK_POSTS);
            setUsingFallback(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
        const interval = setInterval(fetchPosts, 30_000);
        return () => clearInterval(interval);
    }, [fetchPosts]);

    const [featured, ...rest] = posts;

    return (
        <div className={styles.page}>
            {/* ── Broadsheet Header ─────────────────── */}
            <div className={styles.header}>
                <h1>PC Tips & Guides</h1>
                <p className={styles.subtitle}>
                    {usingFallback
                        ? '// sample posts — publish from Admin → Blog Posts'
                        : `// ${posts.length} dispatches from the vault`}
                </p>
            </div>

            {loading ? (
                <div className={styles.emptyState}>⏳ DECRYPTING ARCHIVE...</div>
            ) : posts.length === 0 ? (
                <div className={styles.emptyState}>NO DISPATCHES FOUND</div>
            ) : (
                <>
                    {/* ── Featured Post (full width) ─── */}
                    {featured && (
                        <>
                            <p className={styles.sectionLabel}>— Featured Dispatch</p>
                            <Link href={`/blog/${featured.slug || featured._id}`} className={styles.featuredPost}>
                                <div className={styles.featuredImg}>
                                    {featured.coverImage ? (
                                        <img src={featured.coverImage} alt={featured.title} />
                                    ) : (
                                        <div className={styles.featuredPlaceholder}>EXE<br />TOOL</div>
                                    )}
                                </div>
                                <div className={styles.featuredContent}>
                                    <div className={styles.featuredLabel}>{featured.category}</div>
                                    <h2 className={styles.featuredTitle}>{featured.title}</h2>
                                    <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
                                    <div className={styles.featuredMeta}>
                                        {formatDate(featured.publishedAt || featured._createdAt)}
                                        {featured.readTime && ` · ${featured.readTime}`}
                                    </div>
                                </div>
                            </Link>
                        </>
                    )}

                    {/* ── Grid of remaining posts ─────── */}
                    {rest.length > 0 && (
                        <>
                            <p className={styles.sectionLabel} style={{ marginTop: '3rem' }}>— All Dispatches</p>
                            <div className={styles.postsList}>
                                {rest.map(post => (
                                    <Link href={`/blog/${post.slug || post._id}`} key={post._id} className={styles.postCard}>
                                        <article>
                                            {post.coverImage && (
                                                <div style={{ height: '160px', background: `url(${post.coverImage}) center/cover`, marginBottom: '1.25rem', filter: 'brightness(0.8) saturate(0.5)' }} />
                                            )}
                                            <div className={styles.meta}>
                                                <span className={styles.category}>{post.category}</span>
                                                <span className={styles.dot}>·</span>
                                                <span>{formatDate(post.publishedAt || post._createdAt)}</span>
                                            </div>
                                            <h2 className={styles.title}>
                                                <span className={styles.underline}>{post.title}</span>
                                            </h2>
                                            <p className={styles.excerpt}>{post.excerpt}</p>
                                            <div className={styles.readMore}>Read dispatch <span>→</span></div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}
