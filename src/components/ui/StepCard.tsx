'use client';
import styles from './StepCard.module.css';

interface StepCardProps {
    step: string;
    title: string;
    description: string;
}

export default function StepCard({ step, title, description }: StepCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.ghostNumber}>{step}</div>
            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.lightSweep}></div>
        </div>
    );
}
