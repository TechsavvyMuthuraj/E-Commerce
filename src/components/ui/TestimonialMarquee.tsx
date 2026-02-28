'use client';
import styles from './TestimonialMarquee.module.css';

const reviews = [
    { name: 'Arvind Sharma', rating: 5, body: 'Boot time dropped from 2 minutes to under 20 seconds. Absolutely worth every rupee.' },
    { name: 'Priya Nair', rating: 5, body: 'My FPS in Valorant jumped from 60 to 110. No latency spikes, no frame drops.' },
    { name: 'Rahul D.', rating: 5, body: 'The debloat script is a lifesaver. My laptop feels brand new.' },
    { name: 'Simran K.', rating: 5, body: 'Extremely easy to use. The UI is gorgeous and the optimization actually works.' },
    { name: 'Kunal Verma', rating: 5, body: 'Finally a tool that actually stops Windows Telemetry for good. 10/10 recommend.' },
    { name: 'Sneha Rao', rating: 5, body: 'The network stack tuning fixed my high ping issues in CS2. Incredible stuff.' }
];

export default function TestimonialMarquee() {
    return (
        <section className={styles.marqueeSection}>
            <h2 className={styles.sectionHeaderTitle}>Verified Telemetry</h2>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>

                    {/* First Set */}
                    {reviews.map((r, i) => (
                        <div key={`a-${i}`} className={styles.reviewCard}>
                            <div className={styles.reviewStars}>★★★★★</div>
                            <p className={styles.reviewBody}>"{r.body}"</p>
                            <div className={styles.reviewerName}>— {r.name}</div>
                        </div>
                    ))}

                    {/* Duplicated Set for Infinite Scroll Illusion */}
                    {reviews.map((r, i) => (
                        <div key={`b-${i}`} className={styles.reviewCard}>
                            <div className={styles.reviewStars}>★★★★★</div>
                            <p className={styles.reviewBody}>"{r.body}"</p>
                            <div className={styles.reviewerName}>— {r.name}</div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    );
}
