import Link from 'next/link';
import { use } from 'react';
import styles from './page.module.css';

// Mock Blog Post Fetcher
const getPostDetails = (slug: string) => {
    return {
        slug,
        title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        content: "When we started building the new iteration of our core systems, we realized that the standard approach wasn't going to cut it. We needed sub-millisecond latency, extreme durability, and a developer experience that felt like you were piloting a fighter jet. This log details our choices, the brutal benchmarks, and the final architecture we deployed.\n\n### The Problem with Status Quo\n\nMost frameworks optimize for the 80% use case. That's fine if you're building a simple CRUD app. But when you are processing thousands of concurrent socket connections, standard Node.js garbage collection becomes your biggest enemy.\n\n### Enter Rust (and a bit of Go)\n\nWe didn't rewrite everything. We aggressively identified the hot paths — specifically the payload parsing and the WebSocket handshakes — and moved them to Rust modules... \n\n### The Benchmark Results\n* Latency dropped by 45%\n* Memory usage flatlined at 120MB per node\n* Developer happiness... unmeasurable.",
        date: 'February 24, 2026',
        author: 'Systems Team',
        category: 'Engineering',
        readTime: '5 min read'
    };
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const post = getPostDetails(slug);

    return (
        <article className={`container ${styles.postWrapper}`}>
            <div className={styles.postHeader}>
                <Link href="/blog" className={styles.backLink}>
                    <span className={styles.arrow}>←</span> Back to Dispatch Log
                </Link>

                <div className={styles.metaData}>
                    <span className={styles.categoryBadge}>{post.category}</span>
                    <span className={styles.metaText}>{post.date}</span>
                    <span className={styles.metaText}>{post.readTime}</span>
                </div>

                <h1 className={styles.title}>{post.title}</h1>
                <p className={styles.author}>Transmission from: <strong>{post.author}</strong></p>
            </div>

            <div className={styles.postContent}>
                {/* Render simple mock markdown layout */}
                {post.content.split('\n\n').map((paragraph, index) => {
                    if (paragraph.startsWith('###')) {
                        return <h3 key={index} className={styles.sectionTitle}>{paragraph.replace('###', '').trim()}</h3>;
                    }
                    if (paragraph.startsWith('*')) {
                        return (
                            <ul key={index} className={styles.list}>
                                {paragraph.split('\n').map((item, i) => (
                                    <li key={i}>{item.replace('*', '').trim()}</li>
                                ))}
                            </ul>
                        );
                    }
                    return <p key={index} className={styles.paragraph}>{paragraph}</p>;
                })}
            </div>

            <div className={styles.footer}>
                <div className={styles.shareBlock}>
                    <span className={styles.shareLabel}>End of Transmission. Share:</span>
                    <button className={`btn-secondary ${styles.shareBtn}`}>Copy Link</button>
                </div>
            </div>
        </article>
    );
}
