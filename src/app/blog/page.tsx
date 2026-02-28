import Link from 'next/link';
import styles from './page.module.css';

// Mock Blog Posts
const posts = [
    {
        slug: 'optimizing-workflow-with-nexus',
        title: 'Optimizing Your Workflow with Nexus Engine',
        excerpt: 'Learn how the new caching layers in Nexus Engine Pro can reduce your database load by up to 80% out of the box.',
        date: 'February 24, 2026',
        category: 'Engineering',
        readTime: '5 min read'
    },
    {
        slug: 'state-of-industrial-ui',
        title: 'The State of Industrial UI Design in 2026',
        excerpt: 'We explore why ultra-utilitarian design is taking over SaaS dashboards and how you can implement it in your next project.',
        date: 'February 12, 2026',
        category: 'Design',
        readTime: '8 min read'
    },
    {
        slug: 'release-forge-cli-v2',
        title: 'Release Notes: Forge CLI v2.0',
        excerpt: 'Complete rewrite in Rust. 10x faster builds, new scaffolding commands, and better monorepo support.',
        date: 'January 28, 2026',
        category: 'Product Update',
        readTime: '3 min read'
    }
];

export default function BlogPage() {
    return (
        <div className={`container ${styles.page}`}>
            <div className={styles.header}>
                <h1>Engineering Log</h1>
                <p className={styles.subtitle}>Insights, updates, and deep dives from our team.</p>
            </div>

            <div className={styles.postsList}>
                {posts.map(post => (
                    <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.postCard}>
                        <article>
                            <div className={styles.meta}>
                                <span className={styles.category}>{post.category}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.date}>{post.date}</span>
                                <span className={styles.separator}>•</span>
                                <span className={styles.readTime}>{post.readTime}</span>
                            </div>
                            <h2 className={styles.title}>{post.title}</h2>
                            <p className={styles.excerpt}>{post.excerpt}</p>
                            <div className={styles.readMore}>Read Dispatch <span>→</span></div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
