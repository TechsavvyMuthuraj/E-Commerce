import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            PREMIUM <br />
            <span className={styles.accent}>PC SOFTWARE & OS OPTIMIZATION</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Engineered for pure performance. Discover industrial-grade OS tweaking tools, essential PC software, and exclusive developer resources curated by Muthuraj C.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn-primary">Browse Tools</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className={`container ${styles.developerSection}`}>
        <div className={styles.developerBox}>
          <div className={styles.developerInfo}>
            <h2 className={styles.developerTitle}>System Architecture by Muthuraj C</h2>
            <p className={styles.developerDesc}>
              A dedicated hub for advanced system mechanics and custom-built optimization frameworks. Specializing in high-performance computing, deep OS integration, and seamless software deployment.
            </p>
            <Link href="/contact" className={`btn-primary ${styles.contactBtn}`}>Contact Developer</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
