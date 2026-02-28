'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import blogStyles from './blog-post.module.css';

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
}

import PremiumBlogRenderer from '@/components/ui/PremiumBlogRenderer';
import ProgressBar from '@/components/layout/ProgressBar';
import DotNav from '@/components/layout/DotNav';

// Social link button
function SocialBtn({ href, icon, label }: { href: string; icon: string; label: string }) {
    if (!href) return null;
    const url = href.startsWith('http') ? href : `https://${href}`;
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={blogStyles.socialBtn} title={label}>
            <span className={blogStyles.socialIcon}>{icon}</span>
            <span className={blogStyles.socialLabel}>{label}</span>
        </a>
    );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch('/api/blog', { cache: 'no-store' })
            .then(r => r.json())
            .then(data => {
                const match = (data.posts || []).find(
                    (p: any) => p.slug === slug || p._id === slug
                );
                setPost(match || null);
            })
            .catch(() => setPost(null))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleCopy = () => {
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <article className={`container ${styles.postWrapper}`}>
                <div style={{ color: 'var(--muted)', padding: '4rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Loading article...
                </div>
            </article>
        );
    }

    if (!post) {
        return (
            <article className={`container ${styles.postWrapper}`}>
                <Link href="/blog" className={styles.backLink}><span className={styles.arrow}>←</span> Back to Blog</Link>
                <h1 className={styles.title} style={{ color: 'var(--accent)', fontSize: '2rem', marginTop: '2rem' }}>Post Not Found</h1>
                <p style={{ color: 'var(--muted)', margin: '1rem 0 2rem' }}>
                    <code style={{ background: '#111', padding: '0.2rem 0.5rem' }}>{slug}</code> — this post may not be published yet. Check Admin → Blog Posts.
                </p>
                <Link href="/blog" className="btn-primary">← Browse All Posts</Link>
            </article>
        );
    }

    const coverImg = post.coverImageUrl || post.coverImage;
    const author = post.author || {};
    const links: { label: string; url: string }[] = post.links || [];

    return (
        <article className={`container ${styles.postWrapper}`}>
            <ProgressBar />
            <DotNav />

            {/* Back link */}
            <Link href="/blog" className={styles.backLink}>
                <span className={styles.arrow}>←</span> Back to Blog
            </Link>

            {/* Meta */}
            <div className={styles.metaData}>
                {post.category && <span className={styles.categoryBadge}>{post.category}</span>}
                <span className={styles.metaText}>{formatDate(post.publishedAt || post._createdAt)}</span>
                {post.readTime && <span className={styles.metaText}>{post.readTime}</span>}
            </div>

            {/* Title */}
            <h1 id="title" className={styles.title}>{post.title}</h1>

            {/* Author line */}
            <p className={styles.author}>
                By <strong>Muthuraj C</strong>
                {author.twitter && <> · <a href={author.twitter} target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>@{author.twitter.split('/').pop()}</a></>}
            </p>

            {/* Cover image */}
            {coverImg && (
                <div className={blogStyles.coverImage} style={{ backgroundImage: `url(${coverImg})` }} />
            )}

            {/* Excerpt pull-quote */}
            {post.excerpt && (
                <blockquote className={blogStyles.pullQuote}>{post.excerpt}</blockquote>
            )}

            {/* Body */}
            <div id="content" className={styles.postContent}>
                {post.body
                    ? <PremiumBlogRenderer content={post.body} />
                    : <p className={styles.paragraph} style={{ color: 'var(--muted)' }}>No content yet for this post.</p>
                }
            </div>

            {/* Reference Links */}
            {links.length > 0 && (
                <div id="links" className={blogStyles.linksSection}>
                    <div className={blogStyles.linksSectionTitle}>📎 References &amp; Links</div>
                    <div className={blogStyles.linksList}>
                        {links.map((l, i) => (
                            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className={blogStyles.refLink}>
                                <span className={blogStyles.refLinkIcon}>↗</span>
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Developer Card */}
            <div id="author" className={blogStyles.devCard}>
                <div className={blogStyles.devCardLeft}>
                    <div className={blogStyles.devAvatar}>M</div>
                </div>
                <div className={blogStyles.devInfo}>
                    <div className={blogStyles.devName}>Muthuraj C</div>
                    <div className={blogStyles.devBio}>
                        Windows OS expert specializing in system optimization, debloating, privacy hardening, and gaming performance. Creator of EXE TOOL PC tools.
                    </div>
                    <div className={blogStyles.devSocials}>
                        <SocialBtn href={author.twitter || ''} icon="𝕏" label="Twitter" />
                        <SocialBtn href={author.github || ''} icon="⌥" label="GitHub" />
                        <SocialBtn href={author.linkedin || ''} icon="in" label="LinkedIn" />
                        <SocialBtn href={author.youtube || ''} icon="▶" label="YouTube" />
                        <SocialBtn href={author.website || ''} icon="🌐" label="Website" />
                    </div>
                </div>
            </div>

            {/* Footer / Share */}
            <div className={styles.footer}>
                <div className={styles.shareBlock}>
                    <span className={styles.shareLabel}>Found this helpful? Share it:</span>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className={`btn-secondary ${styles.shareBtn}`} onClick={handleCopy}>
                            {copied ? '✓ Copied!' : 'Copy Link'}
                        </button>
                        <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                            target="_blank" rel="noopener" className={`btn-secondary ${styles.shareBtn}`}>
                            Share on 𝕏
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
