import Link from 'next/link';
import styles from './page.module.css';

const reviews = [
  {
    name: 'Arvind Sharma',
    location: 'Delhi',
    rating: 5,
    title: "Best Windows optimization tool I've used",
    body: 'The Windows 10 Optimizer Pack literally brought my old laptop back to life. Boot time dropped from 2 minutes to under 20 seconds. Absolutely worth every rupee.',
    product: 'Windows 10 Optimizer Pack',
    avatar: 'A',
  },
  {
    name: 'Priya Nair',
    location: 'Bangalore',
    rating: 5,
    title: 'Gaming performance went through the roof',
    body: 'I bought the Gaming Booster Pro and my FPS in Valorant jumped from 60 to 110. No latency spikes, no frame drops. The tool does exactly what it promises.',
    product: 'Gaming Booster Pro',
    avatar: 'P',
  },
  {
    name: 'Rohit Kumar',
    location: 'Mumbai',
    rating: 5,
    title: 'Finally got rid of all the bloatware',
    body: 'Windows 11 came preloaded with so much garbage. The Debloat Toolkit cleaned everything in one click. My system finally feels like MINE again.',
    product: 'Windows 11 Debloat Toolkit',
    avatar: 'R',
  },
  {
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    rating: 4,
    title: 'Privacy Shield is a must-have',
    body: 'Blocked all the telemetry Microsoft sneaks in by default. The tool is clean, simple, and very effective. Setting it up took less than 5 minutes.',
    product: 'Privacy Shield Toolkit',
    avatar: 'S',
  },
];

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            WINDOWS TOOLS &amp; <br />
            <span className={styles.accent}>PC OPTIMIZATION SOFTWARE</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Industrial-grade Windows 10/11 optimization packs, debloat toolkits, privacy shields, and gaming boosters — precision-engineered for peak performance by Muthuraj C.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn-primary">Browse All Tools</Link>
            <Link href="/category/optimization" className="btn-secondary">Optimization Packs</Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className={`container ${styles.reviewsSection}`}>
        <div className={styles.reviewsHeader}>
          <div>
            <h2 className={styles.reviewsTitle}>What Customers Say</h2>
            <p className={styles.reviewsSub}>Verified reviews from real buyers across India</p>
          </div>
          <div className={styles.reviewsRating}>
            <div className={styles.ratingScore}>4.9</div>
            <div>
              <div className={styles.stars}>★★★★★</div>
              <div className={styles.ratingCount}>Based on 200+ reviews</div>
            </div>
          </div>
        </div>

        <div className={styles.reviewsGrid}>
          {reviews.map((r, i) => (
            <div key={i} className={styles.reviewCard}>
              <div className={styles.reviewTop}>
                <div className={styles.reviewAvatar}>{r.avatar}</div>
                <div>
                  <div className={styles.reviewerName}>{r.name}</div>
                  <div className={styles.reviewerLocation}>{r.location}</div>
                </div>
                <div className={styles.reviewStars}>
                  {Array.from({ length: r.rating }, (_, ii) => <span key={`full-${ii}`}>★</span>)}
                  {Array.from({ length: 5 - r.rating }, (_, ii) => <span key={`empty-${ii}`} style={{ color: '#333' }}>★</span>)}
                </div>
              </div>
              <div className={styles.reviewTitle}>&quot;{r.title}&quot;</div>
              <p className={styles.reviewBody}>{r.body}</p>
              <div className={styles.reviewProduct}>
                <span className={styles.verifiedBadge}>✓ Verified</span>
                {r.product}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.reviewsCta}>
          <Link href="/products" className="btn-secondary">Shop Now &amp; Join These Customers →</Link>
        </div>
      </section>

      {/* Developer Section */}
      <section className={`container ${styles.developerSection}`}>
        <div className={styles.developerBox}>
          <div className={styles.developerInfo}>
            <h2 className={styles.developerTitle}>Crafted by Muthuraj C — Windows OS Expert</h2>
            <p className={styles.developerDesc}>
              Every tool in this store is hand-engineered and battle-tested on real hardware. Specializing in Windows registry optimization, kernel-level debloating, privacy hardening, and gaming performance tuning since 2018.
            </p>
            <Link href="/contact" className={`btn-primary ${styles.contactBtn}`}>Contact Developer</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
