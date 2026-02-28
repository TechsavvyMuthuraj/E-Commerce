import Link from 'next/link';
import styles from './page.module.css';
import StaggeredTitle from '@/components/ui/StaggeredTitle';
import StepCard from '@/components/ui/StepCard';
import TerminalBlock from '@/components/ui/TerminalBlock';
import StatsCounter from '@/components/ui/StatsCounter';
import TestimonialMarquee from '@/components/ui/TestimonialMarquee';
import StickyCTA from '@/components/layout/StickyCTA';
import BeforeAfterSlider from '@/components/ui/BeforeAfterSlider';
import HealthChecker from '@/components/ui/HealthChecker';

const terminalCode = [
  "> EXE_TOOL INIT --SYSTEM=WIN11",
  "# Analyzing system architecture...",
  "> DETECTED: 42 unnecessary background telemetry services",
  "> DETECTED: DWM latency spikes via unoptimized registry keys",
  "# Commencing purge protocol...",
  "> DEBLOAT: SUCCESS. 1.2GB RAM freed.",
  "> REGISTRY: SUCCESS. IPC latency reduced by 40%.",
  "> STATUS: Maximum Performance Mode Engaged."
];

export default function Home() {
  return (
    <div className={styles.page}>

      {/* ── CINEMATIC HERO ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContent}`}>
          <StaggeredTitle
            title={["WINDOWS TOOLS &", "<span style='color:var(--accent)'>PC OPTIMIZATION SOFTWARE</span>"]}
            className={styles.heroTitle}
          />
          <p className={styles.heroSubtitle}>
            Industrial-grade Windows 10/11 optimization packs, debloat toolkits, privacy shields, and gaming boosters — precision-engineered for peak performance by Muthuraj C.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products" className="btn-primary">Browse All Tools</Link>
            <Link href="/category/optimization" className="btn-secondary">Optimization Packs</Link>
          </div>
        </div>
      </section>

      {/* ── LIVE STATS STRIP ── */}
      <StatsCounter />

      {/* ── PROCESS / STEP CARDS ── */}
      <section className={`container ${styles.stepsSection}`}>
        <h2 className={styles.sectionHeaderTitle}>Our Optimization Protocol</h2>
        <div className={styles.stepsGrid}>
          <StepCard step="01" title="Analyze & Diagnose" description="We run a deep-level scan of your Windows kernel, identifying telemetry loops, unoptimized registry keys, and resource-heavy bloatware." />
          <StepCard step="02" title="Purge & Debloat" description="Safe removal of built-in bloatware, tracking services, and forced background tasks without compromising core OS stability." />
          <StepCard step="03" title="Overdrive Tuning" description="Injecting custom registry directives to prioritize gaming and heavy workloads, bypassing default OS throttling mechanisms." />
        </div>
      </section>

      {/* ── BEFORE / AFTER INTERACTIVE SLIDER ── */}
      <BeforeAfterSlider />

      {/* ── TWO-COLUMN TERMINAL / STATS GRID ── */}
      <section className={`container ${styles.techSection}`}>
        <div className={styles.twoColumn}>
          {/* Sticky Sidebar */}
          <div className={styles.stickySidebar}>
            <h2 className={styles.sidebarTitle}>Built for Raw Speed.</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>1.2<span>GB</span></div>
                <div className={styles.statLabel}>Avg. RAM Freed</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>-40<span>%</span></div>
                <div className={styles.statLabel}>DWM Latency</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>30<span>sec</span></div>
                <div className={styles.statLabel}>Faster Boot Times</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statNumber}>2x</div>
                <div className={styles.statLabel}>Avg. FPS Boost</div>
              </div>
            </div>
            <div className={styles.tocBox}>
              <p className={styles.tocSubtitle}>Terminal Directives</p>
              <ul className={styles.tocList}>
                <li>— Telemetry Disablement</li>
                <li>— Service Optimization</li>
                <li>— Network Stack Tuning</li>
              </ul>
            </div>
          </div>

          {/* Right Side Terminal */}
          <div className={styles.terminalContainer}>
            <TerminalBlock lines={terminalCode} />
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE PC HEALTH CHECKER ── */}
      <HealthChecker />

      {/* ── REVIEWS (Marquee) ── */}
      <TestimonialMarquee />

      {/* ── STICKY BUY BAR ── */}
      <StickyCTA />

    </div>
  );
}
