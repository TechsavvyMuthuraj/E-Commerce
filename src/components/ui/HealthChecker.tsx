'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './HealthChecker.module.css';

const questions = [
    {
        id: 1,
        text: 'How long does your PC take to boot?',
        options: [
            { text: 'Under 15 seconds', score: 30 },
            { text: '15 - 45 seconds', score: 15 },
            { text: 'Over 45 seconds', score: 0 }
        ]
    },
    {
        id: 2,
        text: 'Do you experience random FPS drops while gaming?',
        options: [
            { text: 'Never', score: 35 },
            { text: 'Sometimes', score: 15 },
            { text: 'Constantly', score: 0 }
        ]
    },
    {
        id: 3,
        text: 'How much RAM is used when totally idle?',
        options: [
            { text: 'Under 2.5 GB', score: 35 },
            { text: '2.5 - 4.0 GB', score: 15 },
            { text: 'Over 4.0 GB', score: 0 }
        ]
    }
];

export default function HealthChecker() {
    const [step, setStep] = useState(0); // 0 = start, 1-3 = questions, 4 = calculating, 5 = result
    const [score, setScore] = useState(0);

    const handleAnswer = (points: number) => {
        setScore(prev => prev + points);
        if (step < 3) {
            setStep(step + 1);
        } else {
            setStep(4);
            setTimeout(() => setStep(5), 1500); // Simulate calculation
        }
    };

    const reset = () => {
        setStep(0);
        setScore(0);
    };

    return (
        <section className={styles.section}>
            <div className={`container ${styles.container}`}>
                <div className={styles.visualColumn}>
                    <h2 className={styles.title}>System Health Check</h2>
                    <p className={styles.subtitle}>Is Windows Telemetry secretly choking your hardware? Take our 30-second diagnostic test to find out.</p>

                    {step === 5 && (
                        <div className={styles.scoreCircle}>
                            <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                <path className={styles.circleBg}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                                <path className={styles.circle}
                                    strokeDasharray={`${score}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    style={{ stroke: score > 70 ? '#4CAF50' : score > 40 ? '#ffaa00' : '#ff5f56' }}
                                />
                            </svg>
                            <div className={styles.scoreText}>
                                <span className={styles.scoreNumber} style={{ color: score > 70 ? '#4CAF50' : score > 40 ? '#ffaa00' : '#ff5f56' }}>{score}</span>
                                <span className={styles.scoreLabel}>/100</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.interactiveColumn}>
                    <div className={styles.card}>

                        {step === 0 && (
                            <div className={styles.startScreen}>
                                <h3>Diagnostics Ready</h3>
                                <p>Begin the 3-step hardware analysis.</p>
                                <button className={styles.actionBtn} onClick={() => setStep(1)}>
                                    START DIAGNOSTIC &gt;
                                </button>
                            </div>
                        )}

                        {step >= 1 && step <= 3 && (
                            <div className={styles.questionScreen}>
                                <div className={styles.progress}>Step {step} of 3</div>
                                <h3>{questions[step - 1].text}</h3>
                                <div className={styles.options}>
                                    {questions[step - 1].options.map((opt, i) => (
                                        <button key={i} className={styles.optBtn} onClick={() => handleAnswer(opt.score)}>
                                            {opt.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className={styles.calcScreen}>
                                <div className={styles.spinner}></div>
                                <p className={styles.monoText}>Analyzing heuristics...</p>
                            </div>
                        )}

                        {step === 5 && (
                            <div className={styles.resultScreen}>
                                <h3 style={{ color: score > 70 ? '#4CAF50' : score > 40 ? '#ffaa00' : '#ff5f56' }}>
                                    {score > 70 ? 'System is Healthy' : score > 40 ? 'Moderate Bloat Detected' : 'CRITICAL PERFORMANCE LOSS'}
                                </h3>
                                <p className={styles.resultDesc}>
                                    {score > 70
                                        ? "Your system is running efficiently. However, our premium tools can still squeeze out an extra 10-15% performance for competitive gaming."
                                        : "Your hardware is being severely bottlenecked by Windows background processes. Our optimization toolkit will unleash your missing performance."}
                                </p>
                                <div className={styles.resultActions}>
                                    <Link href="/products" className={styles.buyBtn}>GET THE SOLUTION</Link>
                                    <button className={styles.retryBtn} onClick={reset}>Test Again</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
